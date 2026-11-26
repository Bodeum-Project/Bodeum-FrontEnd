import type { ParentCategory, InfoSubCategory } from "@/types/info";
import InstitutionIcon from "@/assets/icons/institution.svg?react";
import HospitalIcon from "@/assets/icons/hospital.svg?react";
import WelfareIcon from "@/assets/icons/welfare.svg?react";
import EmploymentIcon from "@/assets/icons/employment.svg?react";
import EducationIcon from "@/assets/icons/education.svg?react";
import SearchInstitutionIcon from "@/assets/icons/searchInstitution.svg?react";
import SearchHospitalIcon from "@/assets/icons/searchHospital.svg?react";
import SearchWelfareIcon from "@/assets/icons/searchWelfare.svg?react";
import SearchEmploymentIcon from "@/assets/icons/searchEmployment.svg?react";
import SearchEducationIcon from "@/assets/icons/searchEducation.svg?react";

export const infoCategoryMap = {
  INSTITUTION: {
    label: "기관",
    icon: InstitutionIcon,
    bgColor: "bg-category-agency-soft",
    textColor: "text-category-agency",
    buttonClass:
      "bg-category-agency-soft text-category-agency active:bg-category-agency active:text-category-agency-soft",
  },
  HOSPITAL: {
    label: "병원",
    icon: HospitalIcon,
    bgColor: "bg-category-hospital-soft",
    textColor: "text-category-hospital",
    buttonClass:
      "bg-category-hospital-soft text-category-hospital active:bg-category-hospital active:text-category-hospital-soft",
  },
  WELFARE: {
    label: "복지",
    icon: WelfareIcon,
    bgColor: "bg-category-welfare-soft",
    textColor: "text-category-welfare",
    buttonClass:
      "bg-category-welfare-soft text-category-welfare active:bg-category-welfare active:text-category-welfare-soft",
  },
  EDUCATION: {
    label: "교육",
    icon: EducationIcon,
    bgColor: "bg-category-edu-soft",
    textColor: "text-category-edu",
    buttonClass:
      "bg-category-edu-soft text-category-edu active:bg-category-edu active:text-category-edu-soft",
  },
  EMPLOYMENT: {
    label: "취업",
    icon: EmploymentIcon,
    bgColor: "bg-category-job-soft",
    textColor: "text-category-job",
    buttonClass:
      "bg-category-job-soft text-category-job active:bg-category-job active:text-category-job-soft",
  },
} as const;

export const infoSubCategoryMap: Record<ParentCategory, readonly InfoSubCategory[]> = {
  INSTITUTION: [
    { id: 5, value: "INSTITUTION_ETC", label: "기관 추천" },
    { id: 6, value: "THERAPY_REHAB", label: "치료·재활기관" },
    { id: 7, value: "WELFARE_CENTER", label: "장애인 복지관" },
    { id: 8, value: "YOUTH_CENTER", label: "청소년 수련관" },
    { id: 9, value: "FAMILY_SUPPORT", label: "장애인가족지원센터" },
  ],
  HOSPITAL: [
    { id: 1, value: "HOSPITAL_ETC", label: "병원 추천" },
    { id: 2, value: "GENERAL_HOSPITAL", label: "병원" },
    { id: 3, value: "PRIMARY_CARE", label: "건강주치의" },
    { id: 4, value: "EMERGENCY_CLINIC", label: "응급의료기관" },
  ],
  WELFARE: [
    { id: 10, value: "WELFARE_ETC", label: "복지 추천" },
    { id: 11, value: "PRIVATE_WELFARE", label: "민간 복지 서비스" },
    { id: 12, value: "NATIONAL_WELFARE", label: "국가 복지 서비스" },
    { id: 13, value: "LOCAL_WELFARE", label: "지역 복지 서비스" },
  ],
  EDUCATION: [
    { id: 14, value: "EDUCATION_ETC", label: "교육 추천" },
    { id: 15, value: "SPECIAL_SCHOOL", label: "특수 학교 현황" },
    { id: 16, value: "SPECIAL_EDU_SUPPORT", label: "특수 교육 지원 센터" },
    { id: 17, value: "LIFELONG_EDU", label: "장애인 평생 교육 기관" },
  ],
  EMPLOYMENT: [
    { id: 18, value: "EMPLOYMENT_ETC", label: "취업 추천" },
    { id: 19, value: "REALTIME_JOB", label: "실시간 구인 정보" },
    { id: 20, value: "KEAD_JOB", label: "KEAD 취업 정보" },
    { id: 21, value: "STANDARD_WORKPLACE", label: "장애인 표준 사업장" },
  ],
};

export const searchCategoryIconMap = {
  INSTITUTION: SearchInstitutionIcon,
  HOSPITAL: SearchHospitalIcon,
  WELFARE: SearchWelfareIcon,
  EMPLOYMENT: SearchEmploymentIcon,
  EDUCATION: SearchEducationIcon,
} as const;

export type InfoCategory = keyof typeof infoCategoryMap;