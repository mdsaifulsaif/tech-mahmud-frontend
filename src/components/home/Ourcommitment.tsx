'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import SectionHeader from '../shared/SectionHeader';
import { BiLeaf } from 'react-icons/bi';

/* =========================================================================
   Brand color: --color-primary: var(--color-primary)
   ========================================================================= */

/* ---------- small leaf used in the eyebrow badge & heading accent ---------- */

const LeafIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 16,
  className = '',
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M20 4C10 4 4 10 4 18c0 1 .1 1.6.3 2C8 12 14 6 20 4Z"
      fill="var(--color-primary)"
    />
  </svg>
);

/* ---------- the 6 solid-fill commitment icons ---------- */

const FreshIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path d="M20 4C10 4 4 10 4 18c0 1 .1 1.6.3 2C8 12 14 6 20 4Z" fill="var(--color-primary)" />
  </svg>
);

const QualityIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path d="M12 2l8 3v6c0 5.5-3.8 9-8 11-4.2-2-8-5.5-8-11V5l8-3Z" fill="var(--color-primary)" />
    <path
      d="M8.5 12.2l2.4 2.4 4.8-5"
      stroke="#fff"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DeliveryIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="7" cy="18" r="2" fill="var(--color-primary)" />
    <circle cx="17" cy="18" r="2" fill="var(--color-primary)" />
    <path
      d="M3 18h2l1-7h6l4 3h2.5a1.5 1.5 0 0 1 1.5 1.5V18h-2"
      fill="none"
      stroke="var(--color-primary)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M6 11h6v3H6z" fill="var(--color-primary)" />
    <circle cx="8" cy="7" r="1.4" fill="var(--color-primary)" />
    <path d="M6.5 8.2h3" stroke="var(--color-primary)" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const PriceTagIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 11.5 11.5 3H19a2 2 0 0 1 2 2v7.5L12.5 21 3 11.5Z"
      fill="var(--color-primary)"
    />
    <circle cx="16" cy="8" r="1.4" fill="#fff" />
  </svg>
);

const HeadsetIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 13v-1a7 7 0 0 1 14 0v1"
      stroke="var(--color-primary)"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <rect x="3.5" y="13" width="3.4" height="5.5" rx="1.4" fill="var(--color-primary)" />
    <rect x="17.1" y="13" width="3.4" height="5.5" rx="1.4" fill="var(--color-primary)" />
    <path
      d="M19 18.5v.5a2.5 2.5 0 0 1-2.5 2.5H14"
      stroke="var(--color-primary)"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const HeartLeafIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 20.5S3 15.2 3 9.2A4.7 4.7 0 0 1 12 7a4.7 4.7 0 0 1 9 2.2c0 6-9 11.3-9 11.3Z"
      fill="var(--color-primary)"
    />
    <path
      d="M9.5 11c2.5 0 4 1.5 4 1.5S12 8 9.5 8"
      stroke="#fff"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ---------- stats-bar icons ---------- */

const PeopleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="8" r="2.6" fill="var(--color-primary)" />
    <circle cx="16" cy="9.5" r="2" fill="var(--color-primary)" opacity="0.7" />
    <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" fill="var(--color-primary)" />
    <path d="M14 19c.2-2 1.6-3.4 3.5-3.4 2 0 3.5 1.4 3.7 3.4" fill="var(--color-primary)" opacity="0.7" />
  </svg>
);

const BasketStatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M4 10h16l-1.5 9a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7L4 10Z" fill="var(--color-primary)" />
    <path
      d="M8 10 9.5 5M16 10 14.5 5M11 10V6"
      stroke="var(--color-primary)"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const ScooterStatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="6.5" cy="18" r="2" fill="var(--color-primary)" />
    <circle cx="17" cy="18" r="2" fill="var(--color-primary)" />
    <path
      d="M3 18h1.5l1-6.5h5.5l3.5 2.6h2.7A1.8 1.8 0 0 1 19 16v2h-1.5"
      fill="none"
      stroke="var(--color-primary)"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M5.5 11.5h5.5v2.6H5.5z" fill="var(--color-primary)" />
  </svg>
);

const StarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2.5l2.9 6 6.6.6-5 4.5 1.5 6.4L12 16.8 5.9 20l1.5-6.4-5-4.5 6.6-.6L12 2.5Z"
      fill="var(--color-primary)"
    />
  </svg>
);

const HeartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 20.5S3 15.2 3 9.2A4.7 4.7 0 0 1 12 7a4.7 4.7 0 0 1 9 2.2c0 6-9 11.3-9 11.3Z"
      fill="var(--color-primary)"
    />
  </svg>
);

/* ---------- village / riverside skyline background (decorative SVG) ---------- */

const VillageSkylineBg: React.FC = () => (
  <svg
    aria-hidden
    viewBox="0 0 1400 360"
    preserveAspectRatio="xMidYMax slice"
    className="pointer-events-none absolute inset-x-0 bottom-0 h-[180px] w-full sm:h-[230px] lg:h-[280px]"
  >
    <g fill="var(--color-primary)">
      {/* rolling ground waves */}
      <path d="M0 300 C 250 260, 500 320, 800 280 S 1200 250, 1400 290 V360 H0 Z" opacity="0.10" />
      <path d="M0 320 C 300 290, 650 340, 950 300 S 1250 270, 1400 310 V360 H0 Z" opacity="0.14" />

      {/* ---- left village cluster ---- */}
      <g opacity="0.16">
        <rect x="20" y="190" width="70" height="90" />
        <path d="M20 190 L55 165 L90 190 Z" />
        <rect x="35" y="210" width="12" height="18" />
        <rect x="63" y="210" width="12" height="18" />
        <rect x="95" y="220" width="55" height="60" />
        <path d="M95 220 L122 200 L150 220 Z" />
        <rect x="160" y="235" width="40" height="45" />
      </g>

      {/* palm trees, left group */}
      <g opacity="0.18">
        <rect x="210" y="190" width="6" height="90" />
        <path d="M213 190 C 190 175, 175 178, 165 168 C 182 168, 198 172, 213 190 Z" />
        <path d="M213 190 C 236 175, 251 178, 261 168 C 244 168, 228 172, 213 190 Z" />
        <path d="M213 190 C 198 168, 198 152, 188 140 C 200 150, 210 165, 213 190 Z" />
        <path d="M213 190 C 228 168, 228 152, 238 140 C 226 150, 216 165, 213 190 Z" />
        <path d="M213 190 C 208 162, 213 148, 209 132 C 218 145, 217 165, 213 190 Z" />
      </g>
      <g opacity="0.16">
        <rect x="270" y="205" width="5" height="75" />
        <path d="M272 205 C 252 192, 240 195, 231 187 C 246 187, 260 190, 272 205 Z" />
        <path d="M272 205 C 292 192, 304 195, 313 187 C 298 187, 284 190, 272 205 Z" />
        <path d="M272 205 C 264 184, 268 172, 261 160 C 270 170, 274 187, 272 205 Z" />
      </g>

      {/* small trees */}
      <g opacity="0.14">
        <circle cx="330" cy="240" r="22" />
        <rect x="326" y="255" width="8" height="25" />
        <circle cx="385" cy="252" r="16" />
        <rect x="382" y="262" width="6" height="18" />
      </g>

      {/* suspension bridge */}
      <g opacity="0.16">
        <path d="M420 270 L1000 270" stroke="var(--color-primary)" strokeWidth="4" fill="none" />
        <path d="M540 270 V190 M880 270 V190" stroke="var(--color-primary)" strokeWidth="6" fill="none" />
        <path
          d="M420 250 Q 540 150 710 220 Q 880 150 1000 250"
          stroke="var(--color-primary)"
          strokeWidth="3"
          fill="none"
        />
        <g stroke="var(--color-primary)" strokeWidth="2">
          <path d="M450 270 L450 245" />
          <path d="M490 270 L490 230" />
          <path d="M540 270 L540 200" />
          <path d="M600 270 L600 215" />
          <path d="M660 270 L660 222" />
          <path d="M710 270 L710 220" />
          <path d="M760 270 L760 222" />
          <path d="M820 270 L820 215" />
          <path d="M880 270 L880 200" />
          <path d="M930 270 L930 230" />
          <path d="M970 270 L970 245" />
        </g>
      </g>

      {/* small tree near bridge */}
      <g opacity="0.16">
        <circle cx="465" cy="245" r="14" />
        <rect x="462" y="255" width="6" height="20" />
      </g>

      {/* ---- right palm + grand landmark cluster ---- */}
      <g opacity="0.18">
        <rect x="1020" y="215" width="6" height="65" />
        <path d="M1023 215 C 1003 202, 990 205, 981 197 C 996 197, 1010 200, 1023 215 Z" />
        <path d="M1023 215 C 1043 202, 1056 205, 1065 197 C 1050 197, 1036 200, 1023 215 Z" />
        <path d="M1023 215 C 1015 196, 1019 184, 1011 174 C 1020 182, 1024 198, 1023 215 Z" />
      </g>
      <g opacity="0.18">
        <rect x="1070" y="200" width="6" height="80" />
        <path d="M1073 200 C 1051 186, 1037 189, 1027 180 C 1043 180, 1058 184, 1073 200 Z" />
        <path d="M1073 200 C 1095 186, 1109 189, 1119 180 C 1103 180, 1088 184, 1073 200 Z" />
        <path d="M1073 200 C 1064 178, 1069 165, 1060 153 C 1070 163, 1074 181, 1073 200 Z" />
      </g>

      {/* landmark domed building (Barisal-style heritage architecture) */}
      <g opacity="0.20">
        <rect x="1130" y="195" width="140" height="85" />
        {/* central tower */}
        <rect x="1182" y="120" width="36" height="75" />
        <path d="M1182 120 Q 1200 95 1218 120 Z" />
        <rect x="1196" y="100" width="8" height="20" />
        <circle cx="1200" cy="98" r="5" />
        {/* small domes */}
        <circle cx="1150" cy="190" r="14" />
        <rect x="1142" y="190" width="16" height="20" />
        <circle cx="1250" cy="190" r="14" />
        <rect x="1242" y="190" width="16" height="20" />
        {/* arches row */}
        <g fill="#fff" opacity="0.55">
          <rect x="1140" y="225" width="10" height="18" />
          <rect x="1158" y="225" width="10" height="18" />
          <rect x="1176" y="225" width="10" height="18" />
          <rect x="1196" y="225" width="10" height="18" />
          <rect x="1214" y="225" width="10" height="18" />
          <rect x="1232" y="225" width="10" height="18" />
          <rect x="1250" y="225" width="10" height="18" />
        </g>
      </g>

      {/* small palm in front of landmark */}
      <g opacity="0.16">
        <rect x="1158" y="225" width="5" height="55" />
        <path d="M1160 225 C 1144 214, 1133 217, 1125 210 C 1138 210, 1150 213, 1160 225 Z" />
        <path d="M1160 225 C 1176 214, 1187 217, 1195 210 C 1182 210, 1170 213, 1160 225 Z" />
        <path d="M1160 225 C 1153 208, 1156 197, 1150 187 C 1158 196, 1161 211, 1160 225 Z" />
      </g>

      {/* small houses far right */}
      <g opacity="0.14">
        <rect x="1300" y="220" width="60" height="60" />
        <path d="M1300 220 L1330 200 L1360 220 Z" />
        <rect x="1313" y="235" width="10" height="15" />
        <rect x="1337" y="235" width="10" height="15" />
      </g>
    </g>
  </svg>
);

/* ---------- floating accent leaves over the skyline ---------- */

const FloatingLeaf: React.FC<{
  className?: string;
  size?: number;
  rotate?: number;
}> = ({ className = '', size = 20, rotate = 0 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    <path
      d="M20 4C10 4 4 10 4 18c0 1 .1 1.6.3 2C8 12 14 6 20 4Z"
      fill="var(--color-primary)"
      opacity="0.55"
    />
  </svg>
);

/* ---------- data ---------- */

interface Commitment {
  id: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const commitments: Commitment[] = [
  {
    id: 1,
    icon: <FreshIcon />,
    title: 'Fresh & Natural',
    desc: 'We source fresh produce directly from local farms and markets.',
  },
  {
    id: 2,
    icon: <QualityIcon />,
    title: 'Quality Assured',
    desc: 'Every product goes through strict quality checks for your safety.',
  },
  {
    id: 3,
    icon: <DeliveryIcon />,
    title: 'Reliable Delivery',
    desc: 'On-time delivery to your doorstep with care and reliability.',
  },
  {
    id: 4,
    icon: <PriceTagIcon />,
    title: 'Best Prices',
    desc: 'We offer the best prices so you get more value every day.',
  },
  {
    id: 5,
    icon: <HeadsetIcon />,
    title: 'Customer First',
    desc: "Your satisfaction is our priority. We're here to help you always.",
  },
  {
    id: 6,
    icon: <HeartLeafIcon />,
    title: 'Support Local',
    desc: 'We support local farmers and contribute to a healthier community.',
  },
];

interface Stat {
  id: number;
  icon: React.ReactNode;
  value: string;
  label: string;
}

const stats: Stat[] = [
  { id: 1, icon: <PeopleIcon />, value: '10K+', label: 'Happy Customers' },
  { id: 2, icon: <BasketStatIcon />, value: '5000+', label: 'Quality Products' },
  { id: 3, icon: <ScooterStatIcon />, value: '10K+', label: 'Successful Deliveries' },
  { id: 4, icon: <StarIcon />, value: '4.8/5', label: 'Customer Rating' },
];

/* ---------- main component ---------- */

const OurCommitment: React.FC = () => {
  const router = useRouter();
  return (
    <section className="py-6 sm:py-8 bg-[#fbfcfa] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="From Barisal, For Barisal"
          description="We are committed to bringing you the freshest products, fastest delivery and best service every day."
          icon={<BiLeaf size={18} />}
          actionLabel="Learn more"
          onAction={() => router.push("/about")}
        />

        {/* ---------- 6-up commitment grid ---------- */}
        <div className="mt-6 grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-4">
          {commitments.map((c, i) => (
            <div
              key={c.id}
              className={[
                'relative px-3 text-center',
                i % 2 === 1 ? 'border-l border-dashed border-gray-200' : '',
                'sm:border-l-0',
                i % 3 !== 0 ? 'sm:border-l sm:border-dashed sm:border-gray-200' : '',
                'lg:border-l-0',
                i !== 0 ? 'lg:border-l lg:border-dashed lg:border-gray-200' : '',
              ].join(' ')}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef5e3]">
                {c.icon}
              </div>
              <h3 className="mt-4 text-[15px] font-bold text-gray-900">{c.title}</h3>
              <span className="mx-auto mt-1.5 block h-[3px] w-6 rounded-full bg-[var(--color-primary)]" />
              <p className="mt-3 text-[13px] leading-relaxed text-gray-500">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* ---------- basket image over village skyline ---------- */}
        <div className="relative mt-12 flex justify-center sm:mt-16">
          <VillageSkylineBg />

          <FloatingLeaf className="absolute left-[16%] top-[10%]" size={16} rotate={-20} />
          <FloatingLeaf className="absolute right-[14%] top-[6%]" size={18} rotate={25} />

          <Image
            src="/box1.png"
            alt="GreenBasket crate filled with fresh vegetables"
            width={420}
            height={340}
            className="relative z-10 h-auto w-[260px] select-none drop-shadow-xl sm:w-[340px] lg:w-[400px]"
          />
        </div>

        {/* ---------- stats bar ---------- */}
        <div className="relative z-10 mt-8 flex flex-col gap-6 rounded-2xl bg-[#eef5e3] px-6 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:gap-x-6">
            {stats.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)]/25 bg-white">
                  {s.icon}
                </span>
                <div>
                  <p className="text-lg font-extrabold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500 sm:text-[13px]">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 border-t border-[var(--color-primary)]/15 pt-6 lg:max-w-xs lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <HeartIcon />
            <div>
              <p className="text-base font-bold text-gray-900">We Grow Together</p>
              <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
                Your trust inspires us to keep improving and serve you better
                every day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurCommitment;