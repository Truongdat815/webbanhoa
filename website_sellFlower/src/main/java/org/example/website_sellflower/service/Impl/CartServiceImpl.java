// File: src/main/java/org/example/website_sellflower/service/Impl/CartServiceImpl.java
package org.example.website_sellflower.service.Impl;

import org.example.website_sellflower.entity.*;
import org.example.website_sellflower.repository.*;
import org.example.website_sellflower.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Cart getCartByAccountId(Long accountId) {
        return cartRepository.findByAccountId(accountId)
                .orElse(null);
    }

    @Override
    public Cart createCart(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Cart cart = new Cart(account);
        return cartRepository.save(cart);
    }

    @Override
    public void addItemToCart(Long accountId, Long productId, Integer quantity) {
        // Get or create cart
        Cart cart = getCartByAccountId(accountId);
        if (cart == null) {
            cart = createCart(accountId);
        }

        // Get product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check stock
        if (product.getStockQuantity() != null && quantity > product.getStockQuantity()) {
            throw new RuntimeException("Số lượng vượt quá tồn kho");
        }

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId);

        if (existingItem.isPresent()) {
            // Update quantity
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + quantity;

            // Check stock again
            if (product.getStockQuantity() != null && newQuantity > product.getStockQuantity()) {
                throw new RuntimeException("Số lượng vượt quá tồn kho");
            }

            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
        } else {
            // Add new item
            CartItem newItem = new CartItem(cart, product, quantity, product.getPrice());
            cart.addItem(newItem);
            cartItemRepository.save(newItem);
        }

        cart.setUpdatedDate(LocalDateTime.now());
        cartRepository.save(cart);
    }

    @Override
    public void updateCartItemQuantity(Long accountId, Long productId, Integer quantity) {
        Cart cart = getCartByAccountId(accountId);
        if (cart == null) {
            throw new RuntimeException("Cart not found");
        }

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        // Check stock
        Product product = item.getProduct();
        if (product.getStockQuantity() != null && quantity > product.getStockQuantity()) {
            throw new RuntimeException("Số lượng vượt quá tồn kho");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        cart.setUpdatedDate(LocalDateTime.now());
        cartRepository.save(cart);
    }

    @Override
    public void removeItemFromCart(Long accountId, Long productId) {
        Cart cart = getCartByAccountId(accountId);
        if (cart == null) {
            throw new RuntimeException("Cart not found");
        }

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        cart.removeItem(item);
        cartItemRepository.delete(item);

        cart.setUpdatedDate(LocalDateTime.now());
        cartRepository.save(cart);
    }

    @Override
    public void clearCart(Long accountId) {
        Cart cart = getCartByAccountId(accountId);
        if (cart != null) {
            // Delete all cart items from database
            List<CartItem> items = new ArrayList<>(cart.getItems());
            for (CartItem item : items) {
                cartItemRepository.delete(item);
            }
            cart.getItems().clear();
            cart.setUpdatedDate(LocalDateTime.now());
            cartRepository.save(cart);
        }
    }

    @Override
    public int getCartItemCount(Long accountId) {
        Cart cart = getCartByAccountId(accountId);
        return cart != null ? cart.getTotalItems() : 0;
    }

    @Override
    public List<CartItem> getCartItems(Long accountId) {
        Cart cart = getCartByAccountId(accountId);
        return cart != null ? cart.getItems() : new ArrayList<>();
    }
}