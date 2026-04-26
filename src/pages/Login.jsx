const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError(null)

  try {
    const response = await api.post('/auth/login', { email, password })
    login(response.data.token, {
      email,
      tier: response.data.tier
    })
    navigate('/dashboard')
  } catch (err) {
    setError('Invalid email or password')
  } finally {
    setLoading(false)
  }
}