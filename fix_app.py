with open('client/src/App.jsx', 'r') as f:
    app_content = f.read()

app_content = app_content.replace(
    "import LoginPage from './pages/LoginPage';",
    ""
)

app_content = app_content.replace(
    '<Route path="/login" element={<LoginPage />} />',
    ""
)

# Replace redirect to login with redirect to home with a state param
app_content = app_content.replace(
    'return <Navigate to="/login" replace />;',
    'return <Navigate to="/?login=true" replace />;'
)

with open('client/src/App.jsx', 'w') as f:
    f.write(app_content)
