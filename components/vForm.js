const app = Vue.createApp({
    // ...
  });
  app.component('VForm', VeeValidate.Form);
  app.component('VField', VeeValidate.Field);
  app.component('ErrorMessage', VeeValidate.ErrorMessage);
  
  app.mount('#app');