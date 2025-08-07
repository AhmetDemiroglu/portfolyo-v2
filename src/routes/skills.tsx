import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import type { IconType } from 'react-icons'
import { FaHtml5, FaCss3Alt, FaJs, FaVuejs, FaReact, FaGithub, FaBuilding, FaChartLine, FaPuzzlePiece, FaUsers, FaClock, FaBootstrap, FaMapMarkedAlt, FaDraftingCompass } from 'react-icons/fa'
import { SiSharp, SiDotnet, SiAdobephotoshop, SiJquery, SiTypescript, SiTailwindcss } from 'react-icons/si'
import { DiNetmagazine } from "react-icons/di";
import { TbSql } from 'react-icons/tb'
import { useTranslation } from 'react-i18next';
import { AnimatedGridBackground } from "../components/GridBackground";

interface Skill {
  name: string;
  description: string;
  icon: IconType;
  level: number;
}

interface SubCategory {
  title: string;
  skills: Skill[];
}

interface MainCategory {
  category: string;
  subCategories?: SubCategory[];
  skills?: Skill[];
}

const skillDetails: { [key: string]: { icon: IconType; level: number } } = {
    'HTML': { icon: FaHtml5, level: 5 },
    'CSS': { icon: FaCss3Alt, level: 5 },
    'JavaScript': { icon: FaJs, level: 4 },
    'TypeScript': { icon: SiTypescript, level: 4 },
    'React': { icon: FaReact, level: 3 },
    'Vue.js': { icon: FaVuejs, level: 4 },
    'jQuery': { icon: SiJquery, level: 2 },
    'Bootstrap': { icon: FaBootstrap, level: 4 },
    'Tailwind CSS': { icon: SiTailwindcss, level: 3 },
    'C#': { icon: SiSharp, level: 4 },
    '.NET Core': { icon: SiDotnet, level: 3 },
    'Entity Framework': { icon: DiNetmagazine, level: 3 },
    'SQL Server': { icon: TbSql, level: 4 },
    'github': { icon: FaGithub, level: 4 },
    'photoshop': { icon: SiAdobephotoshop, level: 4 },
    'autocad': { icon: FaDraftingCompass, level: 5 },
    'netcad': { icon: FaMapMarkedAlt, level: 4 },
    'gis_systems': { icon: FaMapMarkedAlt, level: 3 },
    'real_estate_appraisal': { icon: FaBuilding, level: 5 },
    'reporting_analysis': { icon: FaChartLine, level: 5 },
    'problem_solving': { icon: FaPuzzlePiece, level: 5 },
    'teamwork': { icon: FaUsers, level: 5 },
    'time_management': { icon: FaClock, level: 5 }
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }

function SkillLevelDots({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={`h-2 w-2 mt-1 rounded-full ${ index < level ? 'bg-sky-500' : 'bg-slate-200 dark:bg-slate-600' }`} />
      ))}
    </div>
  )
}

function SkillCard({ skill }: { skill: Skill }) {
    return (
        <motion.div 
            className="rounded-lg bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700 space-y-3 flex flex-col h-full
                       transition-all duration-300 hover:border-sky-500 hover:shadow-lg hover:shadow-sky-500/10"
            variants={itemVariants}
            whileHover={{ y: -5 }}
        >
            <div className="flex items-center gap-4">
                <skill.icon className="h-10 w-10 flex-shrink-0 text-sky-500 dark:text-sky-400" />
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">{skill.name}</h4>
                  <SkillLevelDots level={skill.level} />
                </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 flex-grow">{skill.description}</p>
        </motion.div>
    )
}

export const Route = createFileRoute('/skills')({
  component: SkillsPage,
})

function SkillsPage() {
  const { t } = useTranslation();
  
  const translatedCategories = t('skills_page.skill_categories', { returnObjects: true }) as MainCategory[];

  const mainTitle = t('skills_page.main_title');
  const subtitle = t('skills_page.subtitle');

  const skillsData = translatedCategories.map((mainCategory): MainCategory => {
    let processedTopLevelSkills: Skill[] | undefined;
    if (mainCategory.skills) {
      if (Array.isArray(mainCategory.skills)) { 
        processedTopLevelSkills = mainCategory.skills.map((skill: any): Skill => ({
          ...skill,
          ...(skillDetails[skill.name] || {})
        }));
      } else { 
        processedTopLevelSkills = Object.entries(mainCategory.skills).map(([key, value]): Skill => {
          const skillInfo = value as { name: string, description: string };
          return {
            name: skillInfo.name,
            description: skillInfo.description,
            ...(skillDetails[key] || {})
          }
        });
      }
    }

    const processedSubCategories = mainCategory.subCategories?.map((subCat): SubCategory => {
      const processedSubCatSkills = subCat.skills.map((skill: any): Skill => ({
        ...skill,
        ...(skillDetails[skill.name] || {}) 
      }));

      return {
        ...subCat,
        skills: processedSubCatSkills
      };
    });

    return {
      ...mainCategory,
      skills: processedTopLevelSkills,
      subCategories: processedSubCategories
    };
  });
  
  return (
    <div className="relative min-h-screen pt-16">
      <AnimatedGridBackground />
        <div className="relative z-10 container mx-auto px-8 py-16">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} >
          <h1 className="text-center text-5xl font-bold text-slate-900 dark:text-white">{mainTitle}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-xl text-slate-600 dark:text-slate-400">{subtitle}</p>
        </motion.div>

        <div className="mt-16 space-y-16">
          {skillsData.map((mainCategory) => (
            <div key={mainCategory.category}>
              <h2 className="text-3xl font-semibold text-slate-800 dark:text-white mb-8 border-b-2 border-slate-200 dark:border-slate-700 pb-2">{mainCategory.category}</h2>
              {mainCategory.subCategories ? (
                mainCategory.subCategories.map((subCategory) => (
                  <div key={subCategory.title} className="mb-12">
                    <h3 className="text-2xl font-semibold text-sky-600 dark:text-sky-300 mb-6">{subCategory.title}</h3>
                    <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" animate="visible" >
                      {subCategory.skills.map((skill) => <SkillCard key={skill.name} skill={skill} />)}
                    </motion.div>
                  </div>
                ))
              ) : (
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" animate="visible" >
                  {mainCategory.skills?.map((skill) => <SkillCard key={skill.name} skill={skill} />)}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}