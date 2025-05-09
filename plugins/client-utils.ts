export default defineNuxtPlugin(() => {
  const isDomAvailable = process.client

  return {
    provide: {
      isDomAvailable,
    },
  }
})
