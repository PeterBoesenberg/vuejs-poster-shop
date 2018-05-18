var PRICE = 9.99;
var LOAD_NUM = 10;

new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    cart: [],
    results: [],
    newSearch: 'anime',
    lastSearch: '',
    loading: false,
    price: PRICE
  },
  methods: {
    appendItems: function() {
      console.log('appending');
      if (this.items.length < this.results.length) {
        var append = this.results.slice(
          this.items.length,
          this.items.length + LOAD_NUM
        );
        this.items = this.items.concat(append);
      }
    },
    onSubmit: function() {
      if (this.newSearch.length) {
        this.items = [];
        this.loading = true;
        this.$http.get('/search/'.concat(this.newSearch)).then(function(res) {
          this.lastSearch = this.newSearch;
          this.results = res.data;
          this.appendItems();
          this.loading = false;
        });
      }
    },
    addItem: function(index) {
      this.total += PRICE;
      var item = this.items[index];
      var found = false;
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === item.id) {
          this.cart[i].quantity++;
          found = true;
          break;
        }
      }
      if (!found) {
        this.cart.push({
          id: item.id,
          title: item.title,
          quantity: 1,
          price: PRICE
        });
      }
    },
    inc: function(item) {
      item.quantity++;
      this.total += PRICE;
    },
    dec: function(item) {
      item.quantity--;
      this.total -= PRICE;
      if (item.quantity <= 0) {
        for (var i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1);
            break;
          }
        }
      }
    }
  },
  computed: {
    noMoreItems: function() {
      return (
        this.items.length === this.results.length && this.results.length > 0
      );
    }
  },
  filters: {
    currency: function(price) {
      return '$'.concat(price.toFixed(2));
    }
  },
  mounted: function() {
    this.onSubmit();

    var vueInstance = this;
    var elem = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(elem);
    watcher.enterViewport(function() {
      vueInstance.appendItems();
    });
  }
});
