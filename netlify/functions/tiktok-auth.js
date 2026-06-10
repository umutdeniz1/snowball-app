exports.handler = async function(event) {
  const headers = {
      'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
              'Content-Type': 'application/json'
                }
                  if (event.httpMethod === 'OPTIONS') {
                      return { statusCode: 200, headers, body: '' }
                        }
                          if (event.httpMethod !== 'POST') {
                              return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
                                }
                                  try {
                                      const { code, redirect_uri } = JSON.parse(event.body)
                                          const CLIENT_KEY = 'awj3j59qm035vacm'
                                              const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || 'C1z06yG6sl4bZ6CGlt4sltBz6qHzL9tB'
                                                  const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
                                                        method: 'POST',
                                                              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                                                    body: new URLSearchParams({
                                                                            client_key: CLIENT_KEY,
                                                                                    client_secret: CLIENT_SECRET,
                                                                                            code: code,
                                                                                                    grant_type: 'authorization_code',
                                                                                                            redirect_uri: redirect_uri
                                                                                                                  }).toString()
                                                                                                                      })
                                                                                                                          const tokenData = await tokenRes.json()
                                                                                                                              if (tokenData.error) {
                                                                                                                                    return { statusCode: 400, headers, body: JSON.stringify({ error: tokenData.error_description || tokenData.error }) }
                                                                                                                                        }
                                                                                                                                            const access_token = tokenData.data?.access_token || tokenData.access_token
                                                                                                                                                const open_id = tokenData.data?.open_id || tokenData.open_id
                                                                                                                                                    const userRes = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,username', {
                                                                                                                                                          headers: { 'Authorization': `Bearer ${access_token}` }
                                                                                                                                                              })
                                                                                                                                                                  const userData = await userRes.json()
                                                                                                                                                                      const user = userData.data?.user || {}
                                                                                                                                                                          return { statusCode: 200, headers, body: JSON.stringify({ access_token, open_id, user }) }
                                                                                                                                                                            } catch (err) {
                                                                                                                                                                                return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) }
                                                                                                                                                                                  }
                                                                                                                                                                                  }
