import Image from 'next/image'

export interface TeamMember {
  name: string
  title: string
  owns: string
  bio: string[]
  photo?: { src: string; objectPosition?: string }
}

function Monogram({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <div
      className="flex h-full w-full items-center justify-center bg-surface-2"
      aria-hidden="true"
    >
      <span className="text-[26px] font-medium tracking-[0.08em] text-muted">
        {initials}
      </span>
    </div>
  )
}

/**
 * A person, their remit, and what they have done. No photo is invented for
 * anyone who does not have one; the monogram stands in and the entry keeps its
 * shape.
 */
export default function TeamProfile({ member }: { member: TeamMember }) {
  return (
    <article className="grid gap-5 border-b border-line py-8 sm:grid-cols-12 sm:gap-8">
      <div className="sm:col-span-3">
        <div className="relative aspect-square w-24 overflow-hidden rounded border border-line sm:w-full sm:max-w-[180px]">
          {member.photo ? (
            <Image
              src={member.photo.src}
              alt={`${member.name}, ${member.title} at Bizzi Systems`}
              fill
              sizes="168px"
              className="object-cover"
              style={
                member.photo.objectPosition
                  ? { objectPosition: member.photo.objectPosition }
                  : undefined
              }
            />
          ) : (
            <Monogram name={member.name} />
          )}
        </div>
      </div>

      <div className="sm:col-span-9 lg:col-span-6">
        <h3 className="text-[20px] font-semibold text-ink">{member.name}</h3>
        <p className="mt-1 text-[15px] text-muted">{member.title}</p>
        {member.bio.map((paragraph) => (
          <p key={paragraph} className="mt-4 text-[16px] leading-relaxed text-muted">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="sm:col-span-9 sm:col-start-4 lg:col-span-3 lg:col-start-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          Owns
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-ink">{member.owns}</p>
      </div>
    </article>
  )
}
