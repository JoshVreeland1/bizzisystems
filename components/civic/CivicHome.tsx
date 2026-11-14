"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "./CivicHome.module.css";
const HardwareViewer = dynamic(() => import("./HardwareViewer"), {
  ssr: false,
  loading: () => (
    <div className={styles.modelLoading} role="status">
      Loading the hardware view…
    </div>
  ),
});
export type PartId = "head" | "cover" | "sled" | "bracket";
const parts: { id: PartId; name: string; body: string }[] = [
  {
    id: "head",
    name: "Sensor head",
    body: "The enclosure holds the sensing and cellular hardware. The removable head separates from the fixed mounting bracket.",
  },
  {
    id: "cover",
    name: "Back cover",
    body: "The rear cover closes the enclosure. This view shows the approved v0.7 CAD geometry; it does not establish weatherproofing.",
  },
  {
    id: "sled",
    name: "Electronics sled",
    body: "An internal carrier locates the electronics inside the head. Electronics and batteries are omitted from this four-part model.",
  },
  {
    id: "bracket",
    name: "Mounting bracket",
    body: "The bracket mounts to the curb face at a controlled entrance or exit. One Lane Counter is intended for each one-way lane.",
  },
];
export default function CivicHome() {
  const [selected, setSelected] = useState<PartId>("head");
  const [interactive, setInteractive] = useState(false);
  const [exploded, setExploded] = useState(false);
  const part = parts.find((p) => p.id === selected)!;
  return (
    <div className={styles.site}>
      <section className={styles.hero} aria-labelledby="home-heading">
        <div className={styles.heroCopy}>
          <div className={styles.index}>
            <span>01 / PARKING INFRASTRUCTURE</span>
            <span aria-hidden="true">B—01</span>
          </div>
          <h1 id="home-heading">Measure occupancy at the stall or bay.</h1>
          <p className={styles.lede}>
            Camera-free, wire-free sensors. We’re bringing parking data across
            your lots and garages into one system, with a map to help your
            drivers find a space.
          </p>
          <div className={styles.heroActions}>
            <Link
              href="/contact?topic=deployment"
              className="b-btn b-btn-primary"
            >
              Discuss a deployment{" "}
              <span className="b-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
            <Link href="/waitlist" className="b-btn b-btn-ghost">
              Join the waitlist <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <p className={styles.heroNote}>
            Talk through your sites. Get updates as the system develops.
          </p>
        </div>
        <figure className={styles.heroVisual}>
          <div className={styles.coordinate}>
            <span>LC / 0.7</span>
            <span>ISOMETRIC / CAD</span>
          </div>
          <span className={styles.crossTop} aria-hidden="true">
            +
          </span>
          <div className={styles.heroCad}>
            <Image
              src="/hardware/lane-counter-v07-assembly.svg"
              alt="Actual v0.7 CAD isometric drawing of the Bizzi Lane Counter enclosure and mounting bracket"
              width={1400}
              height={600}
              priority
              unoptimized
            />
          </div>
          <span className={styles.crossBottom} aria-hidden="true">
            +
          </span>
          <div className={styles.visualDatum} aria-hidden="true">
            X / Y / Z<br />
            REV. 007
          </div>
          <figcaption>
            <span>FIG. 01 — LANE COUNTER</span>
            <span>v0.7 CAD baseline</span>
          </figcaption>
        </figure>
      </section>
      <div className={styles.methodStrip} aria-label="System overview">
        <div>
          <span>APPROACH</span>
          <strong>Camera-free sensing</strong>
        </div>
        <div>
          <span>INSTALLATION</span>
          <strong>No field wiring</strong>
        </div>
        <div>
          <span>FOR OPERATORS</span>
          <strong>Facility-wide data</strong>
        </div>
        <div>
          <span>PLANNED FOR DRIVERS</span>
          <strong>Parking availability map</strong>
        </div>
      </div>
      <section
        id="platform"
        className={styles.section}
        aria-labelledby="platform-heading"
      >
        <div className={styles.sectionLabel}>
          <span>02 / PLATFORM</span>
          <span>THE PLANNED SYSTEM</span>
        </div>
        <div className={styles.editorial}>
          <h2 id="platform-heading">One system for your parking sites.</h2>
          <div>
            <p>
              Bizzi is building a turnkey service: sensors, connectivity and
              parking data, managed together.
            </p>
            <p>
              Operators would see their lots and garages in one place. Drivers
              would use an availability map to decide where to park.
            </p>
            <Link className={styles.textLink} href="/contact?topic=deployment">
              Discuss your sites <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <div className={styles.productRows}>
          <div>
            <span>01</span>
            <h3>At the space</h3>
            <p>
              The PS Sensor measures occupancy at an individual stall or bay,
              without a camera.
            </p>
            <span>PS SENSOR</span>
          </div>
          <div>
            <span>02</span>
            <h3>At the entrance</h3>
            <p>
              The Lane Counter is being developed to count vehicles entering and
              leaving controlled one-way lanes.
            </p>
            <a href="#hardware">LANE COUNTER ↓</a>
          </div>
          <div>
            <span>03</span>
            <h3>Across the network</h3>
            <p>
              Planned operator tools bring site data together. The driver-facing
              map is a future offering.
            </p>
            <span>PLANNED SOFTWARE</span>
          </div>
        </div>
      </section>
      <section
        id="hardware"
        className={styles.section}
        aria-labelledby="hardware-heading"
      >
        <div className={styles.sectionLabel}>
          <span>03 / HARDWARE</span>
          <span>LANE COUNTER / v0.7</span>
        </div>
        <div className={styles.editorial}>
          <h2 id="hardware-heading">Explore the Lane Counter.</h2>
          <p>
            A curb-mounted device for controlled entrances and exits. Inspect
            the four enclosure parts in the approved CAD model.
          </p>
        </div>
        <div className={styles.hardwareGrid}>
          <div className={styles.hardwareViewer}>
            <div className={styles.viewerToolbar}>
              <span>FIG. 02 / MECHANICAL ASSEMBLY</span>
              {interactive ? (
                <button
                  type="button"
                  aria-pressed={exploded}
                  onClick={() => setExploded(!exploded)}
                  className={styles.viewButton}
                >
                  {exploded ? "Reassemble" : "Explode view"}{" "}
                  <span aria-hidden="true">↗</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setInteractive(true)}
                  className={styles.viewButton}
                >
                  Open 3D view <span aria-hidden="true">↗</span>
                </button>
              )}
            </div>
            <div className={styles.modelFrame}>
              {interactive ? (
                <HardwareViewer selected={selected} exploded={exploded} />
              ) : (
                <Image
                  src="/hardware/lane-counter-v07-assembly.svg"
                  alt="Lane Counter v0.7 engineering assembly"
                  width={1400}
                  height={600}
                  unoptimized
                />
              )}
            </div>
            <p className={styles.viewerCaption}>
              {interactive
                ? "Drag or use arrow keys to rotate · select a part"
                : "Engineering drawing · open 3D to rotate and separate the parts"}
            </p>
          </div>
          <div className={styles.componentPanel}>
            <p className={styles.panelTitle}>Select a component</p>
            <div role="group" aria-label="Select hardware component">
              {parts.map((p, i) => (
                <button
                  type="button"
                  key={p.id}
                  aria-pressed={selected === p.id}
                  className={
                    selected === p.id ? styles.partActive : styles.part
                  }
                  onClick={() => setSelected(p.id)}
                >
                  <span>0{i + 1}</span>
                  <span>{p.name}</span>
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
            <div className={styles.memo} aria-live="polite" aria-atomic="true">
              <h3>{part.name}</h3>
              <p>{part.body}</p>
            </div>
            <p className={styles.modelNote}>
              Lane Counter CAD baseline. Field performance remains under
              development.
            </p>
          </div>
        </div>
      </section>
      <section
        id="markets"
        className={styles.section}
        aria-labelledby="markets-heading"
      >
        <div className={styles.sectionLabel}>
          <span>04 / MARKETS</span>
          <span>LOTS / GARAGES / CURBS</span>
        </div>
        <div className={styles.editorial}>
          <h2 id="markets-heading">Start with the sites you manage.</h2>
          <p>
            We’ll work through your parking layout, the data you need and how it
            would fit your operations.
          </p>
        </div>
        <div className={styles.marketRows}>
          <Link href="/contact?topic=municipal">
            <span>01</span>
            <h3>Cities & public parking</h3>
            <p>
              Understand use across municipal lots, garages and curbside spaces.
            </p>
            <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/contact?topic=operators">
            <span>02</span>
            <h3>Parking operators</h3>
            <p>
              Bring multiple facilities into one view for your operating team.
            </p>
            <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/contact?topic=campuses">
            <span>03</span>
            <h3>Campuses & destinations</h3>
            <p>Plan for visitors who need to find parking across your sites.</p>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <section
        id="validation"
        className={styles.section}
        aria-labelledby="validation-heading"
      >
        <div className={styles.sectionLabel}>
          <span>05 / VALIDATION</span>
          <span className={styles.status}>
            <i aria-hidden="true" /> PRODUCT CONTEXT
          </span>
        </div>
        <div className={styles.editorial}>
          <h2 id="validation-heading">
            PS Sensor validation informs what comes next.
          </h2>
          <div>
            <p>
              Bizzi’s PS Sensor has been validated for stall-level occupancy.
              That work is separate from the Lane Counter, which is still being
              developed.
            </p>
            <p>
              The wider turnkey service and driver map are planned offerings.
              Talk with us about suitability and availability for your sites.
            </p>
          </div>
        </div>
      </section>
      <section className={styles.contactBand} aria-labelledby="contact-heading">
        <div>
          <div className={styles.sectionLabel}>06 / GET IN TOUCH</div>
          <h2 id="contact-heading">Let’s talk about your parking.</h2>
          <p>
            Share your sites and the information you need. We’ll discuss where
            Bizzi could fit.
          </p>
        </div>
        <div className={styles.contactActions}>
          <Link
            className="b-btn b-btn-primary"
            href="/contact?topic=deployment"
          >
            Discuss a deployment{" "}
            <span className="b-arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
          <Link className="b-btn b-btn-ghost" href="/waitlist">
            Join the waitlist <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
