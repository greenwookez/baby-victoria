import { Spinner } from './_components/Spinner'

export default function HomePageLoading() {
  return (
    <div className="flex flex-col gap-2 items-center">
      <Spinner />
      <span className="text-muted-foreground text-base animate-pulse">Loading...</span>
    </div>
  )
}
