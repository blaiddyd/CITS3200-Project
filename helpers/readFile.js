export default async file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(reader.error)
    reader.onload = () => {
      resolve(reader.result)
    }

    reader.readAsText(file)
  })
