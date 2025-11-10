// File: src/main/java/org/example/website_sellflower/service/CartService.java
package org.example.website_sellflower.service;

import org.example.website_sellflower.entity.Cart;
import org.example.website_sellflower.entity.CartItem;
import org.example.website_sellflower.entity.Product;

import java.util.List;

public interface CartService {
    Cart getCartByAccountId(Long accountId);
    Cart createCart(Long accountId);
    void addItemToCart(Long accountId, Long productId, Integer quantity);
    void updateCartItemQuantity(Long accountId, Long productId, Integer quantity);
    void removeItemFromCart(Long accountId, Long productId);
    void clearCart(Long accountId);
    int getCartItemCount(Long accountId);
    List<CartItem> getCartItems(Long accountId);
}