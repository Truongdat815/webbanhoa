import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`/orders/${user.id}`)
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Vui lòng đăng nhập để xem dashboard</h2>
          <Link to="/login" className="btn btn-primary">
            Đăng nhập
          </Link>
        </div>
      </div>
    )
  }

  const orderSuccess = searchParams.get('order') === 'success'

  return (
    <div className="container py-5">
      {orderSuccess && (
        <div className="alert alert-success" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại Bloomora.
        </div>
      )}
      
      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Tài khoản</h5>
              <p className="card-text">
                <strong>Xin chào, {user.name}!</strong>
              </p>
              <p className="card-text text-muted">
                {user.email}
              </p>
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={logout}
              >
                Đăng xuất
              </button>
            </div>
          </div>
          
          <div className="list-group mt-3">
            <Link to="/dashboard" className="list-group-item list-group-item-action active">
              <i className="fas fa-tachometer-alt me-2"></i>
              Dashboard
            </Link>
            <Link to="/orders" className="list-group-item list-group-item-action">
              <i className="fas fa-shopping-bag me-2"></i>
              Đơn hàng
            </Link>
            <Link to="/profile" className="list-group-item list-group-item-action">
              <i className="fas fa-user me-2"></i>
              Thông tin cá nhân
            </Link>
            <Link to="/addresses" className="list-group-item list-group-item-action">
              <i className="fas fa-map-marker-alt me-2"></i>
              Địa chỉ
            </Link>
          </div>
        </div>
        
        <div className="col-md-9">
          <h2>Dashboard</h2>
          
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body">
                  <i className="fas fa-shopping-bag fa-2x text-primary mb-2"></i>
                  <h5 className="card-title">{orders.length}</h5>
                  <p className="card-text">Tổng đơn hàng</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body">
                  <i className="fas fa-clock fa-2x text-warning mb-2"></i>
                  <h5 className="card-title">
                    {orders.filter(order => order.status === 'pending').length}
                  </h5>
                  <p className="card-text">Đang xử lý</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body">
                  <i className="fas fa-check-circle fa-2x text-success mb-2"></i>
                  <h5 className="card-title">
                    {orders.filter(order => order.status === 'completed').length}
                  </h5>
                  <p className="card-text">Hoàn thành</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h5>Đơn hàng gần đây</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
                  <h5>Chưa có đơn hàng nào</h5>
                  <p className="text-muted">Hãy bắt đầu mua sắm tại Bloomora</p>
                  <Link to="/products" className="btn btn-primary">
                    Mua sắm ngay
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Mã đơn hàng</th>
                        <th>Ngày đặt</th>
                        <th>Số sản phẩm</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td>{order.items.length}</td>
                          <td>{order.total.toLocaleString('vi-VN')}đ</td>
                          <td>
                            <span className={`badge ${
                              order.status === 'pending' ? 'bg-warning' :
                              order.status === 'completed' ? 'bg-success' :
                              'bg-secondary'
                            }`}>
                              {order.status === 'pending' ? 'Đang xử lý' :
                               order.status === 'completed' ? 'Hoàn thành' :
                               'Đã hủy'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
