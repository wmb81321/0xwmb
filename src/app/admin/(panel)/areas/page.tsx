export const dynamic = 'force-dynamic'
import { areaSummaries } from '@/lib/areas-status'
import AreaTiles from '../../components/AreaTiles'

export default async function AreasIndex() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="flex items-center gap-4 text-4xl font-semibold tracking-tight text-primary">
        <span className="data-pulse" />Areas
      </h1>
      <AreaTiles summaries={await areaSummaries()} />
    </div>
  )
}
