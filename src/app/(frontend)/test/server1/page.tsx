function fake(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 2000))
}

export default async function Page() {
  await fake()
  return <span>Server 1</span>
}
