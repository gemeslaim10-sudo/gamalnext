import { STATS } from './HeroConfig';
import { AnimatedCounter } from './AnimatedCounter';

export function HeroStatsGrid() {
    return (
        <>
            {/* Stats Grid - Perfectly Vertically Aligned, NO OVERLAP (Desktop 2XL) */}
            <div className="hidden 2xl:grid grid-cols-2 gap-4 z-10 relative self-center flex-shrink-0">
                {STATS.map(({ label, value, suffix, icon: Icon }, index) => (
                    <div 
                        key={label} 
                        className={`group/stat relative bg-gradient-to-b from-[#0b1120] to-[#040814] border border-slate-700/60 p-4 lg:p-5 rounded-[1.5rem] flex flex-col items-center justify-center text-center w-[110px] h-[110px] md:w-[130px] md:h-[130px] xl:w-[140px] xl:h-[140px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-500 hover:-translate-y-1 flex-shrink-0 ${index % 2 !== 0 ? 'translate-y-6 lg:translate-y-8' : ''}`}
                    >
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/stat:opacity-100 rounded-[1.5rem] transition-opacity duration-500"></div>
                        <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500 mb-2 lg:mb-3 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover/stat:scale-110 transition-transform duration-300" />
                        <span className="text-xl xl:text-2xl font-black text-white tracking-tight leading-none mb-1">
                            <AnimatedCounter target={value} suffix={suffix} />
                        </span>
                        <span className="text-[9px] xl:text-[10px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">{label}</span>
                    </div>
                ))}
            </div>

            {/* Stats Row for Mobile & Tablet & LG Screens */}
            <div className="stagger-5 w-full mt-10 2xl:hidden relative z-20">
                <div className="grid grid-cols-2 gap-3 px-2">
                    {STATS.map(({ label, value, suffix, icon: Icon }) => (
                        <div key={label} className="bg-gradient-to-b from-[#0b1120] to-[#040814] border border-slate-800 p-4 sm:p-5 rounded-[1.5rem] flex flex-col items-center text-center shadow-2xl">
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mb-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
                                <AnimatedCounter target={value} suffix={suffix} />
                            </span>
                            <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
