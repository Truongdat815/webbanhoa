import { useState, useEffect } from 'react'

function App() {
  const [flowers, setFlowers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFlowers()
  }, [])

  const fetchFlowers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/flowers')
      if (response.ok) {
        const data = await response.json()
        setFlowers(data)
      } else {
        console.error('Failed to fetch flowers')
      }
    } catch (error) {
      console.error('Error fetching flowers:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-pink-600">🌸 WebBanHoa</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-pink-600 transition-colors">Trang chủ</a>
              <a href="#" className="text-gray-700 hover:text-pink-600 transition-colors">Sản phẩm</a>
              <a href="#" className="text-gray-700 hover:text-pink-600 transition-colors">Giới thiệu</a>
              <a href="#" className="text-gray-700 hover:text-pink-600 transition-colors">Liên hệ</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Hoa tươi cho mọi dịp đặc biệt
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá bộ sưu tập hoa tươi đẹp nhất với giá cả hợp lý và dịch vụ giao hàng tận nơi
          </p>
        </div>

        {/* Flowers Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {flowers.map((flower) => (
              <div key={flower.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-64 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                  <span className="text-6xl">🌸</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{flower.name}</h3>
                  <p className="text-gray-600 mb-4">{flower.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-pink-600">{flower.price} VNĐ</span>
                    <button className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors">
                      Mua ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">🌸 WebBanHoa</h3>
            <p className="text-gray-400 mb-4">Cửa hàng hoa tươi uy tín với hơn 10 năm kinh nghiệm</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Zalo</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
