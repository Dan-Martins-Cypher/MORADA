const products = document.querySelectorAll('.product-card');
const filters = document.querySelectorAll('.filter');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const whatsappButton = document.getElementById('whatsappButton');
const clearButton = document.getElementById('clearButton');
const whatsappNumber = '5519982305570';
let cart = JSON.parse(localStorage.getItem('moradaDaOncaCart') || '{}');

filters.forEach(button => {
  button.addEventListener('click', () => {
    filters.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    products.forEach(product => {
      product.classList.toggle('hidden', filter !== 'todos' && product.dataset.category !== filter);
    });
  });
});

document.querySelectorAll('.add-button').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    const name = card.dataset.name;
    cart[name] = (cart[name] || 0) + 1;
    saveCart();
    renderCart();
    document.getElementById('pedido').scrollIntoView({behavior:'smooth'});
  });
});

function saveCart(){localStorage.setItem('moradaDaOncaCart', JSON.stringify(cart));}
function totalItems(){return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);}
function renderCart(){
  const entries = Object.entries(cart);
  const count = totalItems();
  cartCount.textContent = `${count} ${count === 1 ? 'item' : 'itens'}`;
  whatsappButton.disabled = count === 0;
  clearButton.disabled = count === 0;
  if(!entries.length){cartItems.innerHTML='<p class="empty">Seu pedido ainda está vazio.</p>';return;}
  cartItems.innerHTML = entries.map(([name, quantity]) => `
    <div class="cart-row">
      <strong>${escapeHtml(name)}</strong>
      <div class="qty">
        <button type="button" data-action="minus" data-name="${escapeAttr(name)}" aria-label="Remover uma unidade">−</button>
        <span>${quantity}</span>
        <button type="button" data-action="plus" data-name="${escapeAttr(name)}" aria-label="Adicionar uma unidade">+</button>
      </div>
    </div>`).join('');
  cartItems.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      const name = button.dataset.name;
      if(button.dataset.action === 'plus') cart[name]++;
      if(button.dataset.action === 'minus') { cart[name]--; if(cart[name] <= 0) delete cart[name]; }
      saveCart();
      renderCart();
    });
  });
}

whatsappButton.addEventListener('click', () => {
  const lines = Object.entries(cart).map(([name, quantity]) => `• ${quantity}x ${name}`);
  const message = `Olá! Quero fazer um pedido no Sítio Morada da Onça:\n\n${lines.join('\n')}\n\nGostaria de saber os preços, disponibilidade e condições de entrega.`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
});

clearButton.addEventListener('click', () => {cart={};saveCart();renderCart();});
function escapeHtml(value){return value.replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));}
function escapeAttr(value){return encodeURIComponent(value);}
renderCart();
