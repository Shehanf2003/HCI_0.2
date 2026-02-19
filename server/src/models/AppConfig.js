const mongoose = require('mongoose');

const appConfigSchema = mongoose.Schema({
  homeBackgroundUrl: {
    type: String,
    required: false,
    default: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80'
  }
}, {
  timestamps: true
});

const AppConfig = mongoose.model('AppConfig', appConfigSchema);

module.exports = AppConfig;
