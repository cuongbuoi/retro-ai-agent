export async function onRequest(context) {
  // Xử lý request qua server function của Nuxt
  try {
    return await context.next()
  } catch (err) {
    return new Response(`Server Error: ${err.message}`, {
      status: 500,
    })
  }
}
