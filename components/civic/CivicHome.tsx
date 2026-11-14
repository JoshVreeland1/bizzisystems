"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./CivicHome.module.css";

type PartId="head"|"cover"|"sled"|"bracket";
const parts:{id:PartId;name:string;title:string;body:string;status:string}[]=[
 {id:"head",name:"Sensor head",title:"Access the device without removing the bracket.",body:"The proposed removable head is retained by two security screws. Service time, sealing, and field durability still require validation.",status:"Prototype architecture"},
 {id:"cover",name:"Back cover",title:"A seal that must be proven.",body:"Prototype A's v0.6 enclosure leaked. The v0.7 drawing is an engineering baseline, not evidence of a watertight finished device. A subsequent pilot redesign is planned.",status:"Redesign required"},
 {id:"sled",name:"Electronics sled",title:"Radar, magnetic sensing, and communications.",body:"The prototype uses an Acconeer A121 radar, MMC5983MA magnetometer, and cellular Notecard. Reliable vehicle detection and a low-power wake strategy are still being tested.",status:"Prototype / test stage"},
 {id:"bracket",name:"Mounting bracket",title:"A curb-face installation concept.",body:"The low-profile bracket is intended to stay fixed while the head can be serviced. Attachment, traffic contact, installation permissions, and site suitability require testing.",status:"Mechanical validation pending"}
];
export default function CivicHome(){
 const [selected,setSelected]=useState<PartId>("head");
 const [view,setView]=useState<"assembled"|"details">("assembled");
 const part=parts.find(p=>p.id===selected)!;
 return <div className={styles.site}>
   <section className={styles.hero} id="platform" aria-labelledby="home-heading">
     <div className={styles.heroCopy}>
       <p className={styles.kicker}>Infrastructure for measured parking operations</p>
       <h1 id="home-heading">Count vehicles.<br/><span>Connect operations.</span></h1>
       <p className={styles.lede}>Bizzi is developing a camera-free vehicle counter for controlled garage and surface-lot entrances. Count data is intended to support facility occupancy estimates and integration with existing parking systems.</p>
       <div className={styles.heroActions}><Link href="/contact?topic=deployment" className="b-btn b-btn-primary">Discuss a deployment <span className="b-arrow" aria-hidden="true">↗</span></Link><a href="#hardware" className="b-btn b-btn-secondary">Explore the hardware <span aria-hidden="true">↓</span></a></div>
       <div className={styles.contextLine}><span className={styles.contextDot} aria-hidden="true"/><span>Prototype in development · Accuracy and battery life not yet validated</span></div>
     </div>
     <div className={styles.heroVisual} aria-label="CAD drawing of Bizzi Lane Counter v0.7 prototype">
       <div className={styles.coordinateTop}>BIZZI / ENGINEERING STUDY 07</div><span className={styles.crossTop} aria-hidden="true">+</span>
       <div className={styles.heroCad}><Image src="/hardware/lane-counter-v07-assembly.svg" alt="Actual v0.7 CAD isometric line drawing of the Bizzi Lane Counter enclosure, cover and bracket" width={1400} height={600} priority unoptimized/></div>
       <div className={styles.visualFooter}><span>LANE COUNTER / v0.7</span><span>ENGINEERING CAD · NOT FIELD-VALIDATED</span></div>
       <span className={styles.crossBottom} aria-hidden="true">×</span>
     </div>
   </section>
   <section className={styles.methodStrip} aria-label="System concept">
     <div><span>01</span><strong>Count vehicles at controlled lanes</strong></div>
     <div><span>02</span><strong>Estimate facility occupancy</strong></div>
     <div><span>03</span><strong>Deliver data to operator systems</strong></div>
   </section>
   <section className={styles.hardwareSection} id="hardware" aria-labelledby="hardware-title">
      <div className={styles.sectionHeading}><div><p className={styles.sectionKicker}>The hardware</p><h2 id="hardware-title">Designed for the curb.<br/>Built to be serviced.</h2></div><p>Explore the v0.7 mechanical baseline. Select a component to learn what it means for an operator and which claims still require testing.</p></div>
      <div className={styles.hardwareGrid}>
        <div className={styles.hardwareViewer}>
          <div className={styles.viewerToolbar}><span>PRODUCT VIEW / v0.7</span><div role="group" aria-label="Product view"><button type="button" className={view==="assembled"?styles.toggleActive:styles.toggle} onClick={()=>setView("assembled")} aria-pressed={view==="assembled"}>Assembly</button><button type="button" className={view==="details"?styles.toggleActive:styles.toggle} onClick={()=>setView("details")} aria-pressed={view==="details"}>Details</button></div></div>
          <div className={view==="details"?styles.cadDetail:styles.cadFrame}><Image src="/hardware/lane-counter-v07-assembly.svg" alt="Engineering CAD drawing of the v0.7 Lane Counter housing" width={1400} height={600} unoptimized/><div className={styles.viewerAnnotation}><span aria-hidden="true">+</span> CAD-derived geometry / static engineering preview</div></div>
          <p className={styles.viewerDisclaimer}>Interactive 3D model conversion is the next implementation gate. This drawing comes from the approved v0.7 engineering package.</p>
        </div>
        <div className={styles.componentPanel}>
          <p className={styles.panelTitle}>Component notes</p>
          <div className={styles.partList} role="group" aria-label="Select hardware component">{parts.map((p,i)=><button type="button" key={p.id} aria-pressed={selected===p.id} className={selected===p.id?styles.partActive:styles.part} onClick={()=>setSelected(p.id)}><span className={styles.partNumber}>0{i+1}</span><span>{p.name}</span><span aria-hidden="true">↗</span></button>)}</div>
          <div className={styles.memo} aria-live="polite"><span className={styles.memoStatus}>{part.status}</span><h3>{part.title}</h3><p>{part.body}</p></div>
        </div>
      </div>
   </section>
   <section className={styles.infrastructure} id="applications" aria-labelledby="applications-heading"><div className={styles.sectionHeading}><div><p className={styles.sectionKicker}>The use case</p><h2 id="applications-heading">Count at the entrance.<br/>Understand the facility.</h2></div><p>Designed initially for controlled one-way lanes at garages and surface lots. Counts would be associated with a configured entry or exit direction.</p></div>
    <div className={styles.threeColumns}><div><span className={styles.smallNumber}>01 / SENSING</span><h3>One lane at a time.</h3><p>Radar and magnetic sensing are being tested against real vehicles, adjacent traffic, and closely spaced passes.</p></div><div><span className={styles.smallNumber}>02 / DELIVERY</span><h3>Cellular, not a gateway.</h3><p>The intended path is device to cellular to Blues Notehub and the Bizzi backend, with buffering and health reporting.</p></div><div><span className={styles.smallNumber}>03 / USE</span><h3>Data for existing systems.</h3><p>Timestamped entry and exit counts are intended to inform occupancy estimates and authorized integrations.</p></div></div>
   </section>
   <section className={styles.validation} id="validation" aria-labelledby="validation-heading"><div><p className={styles.sectionKicker}>Validation</p><h2 id="validation-heading">Measured results matter.</h2><p>The Lane Counter is an active prototype, not a field-validated commercial device. Our proposed field gate requires independently labeled vehicle passes, vehicle-by-vehicle precision and recall measurements, and a 24-hour independent count comparison.</p></div><div className={styles.validationFacts}><div><span>Current stage</span><strong>Prototype testing</strong></div><div><span>Accuracy target</span><strong>≥98% precision and recall</strong><small>Target only · not achieved</small></div><div><span>Pilot-ready batch target</span><strong>10 units by Dec 31, 2026</strong><small>Schedule target · not completed</small></div></div></section>
   <section className={styles.contactBand} aria-labelledby="contact-heading"><div><p className={styles.sectionKicker}>Discuss your facilities</p><h2 id="contact-heading">A better view of parking starts with a conversation.</h2><p>Tell us about your facilities, lane configuration, and integration needs. We'll discuss what a responsible evaluation would require.</p></div><Link className="b-btn b-btn-primary" href="/contact?topic=deployment">Discuss a deployment <span className="b-arrow" aria-hidden="true">↗</span></Link></section>
 </div>;
}
