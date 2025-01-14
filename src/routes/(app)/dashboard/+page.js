import Briefcase from 'lucide-svelte/icons/briefcase';
import GraduationCap from 'lucide-svelte/icons/graduation-cap';
import Presentation from 'lucide-svelte/icons/presentation';
import Users from 'lucide-svelte/icons/users';

export const load = ({ data }) => {
  const {
    totalStudents,
    totalMaleStudents,
    totalFemaleStudents,
    totalClassrooms,
    totalTeachers,
    totalUsers,
    recentActivities,
  } = data;

  const overviews = [
    { icon: GraduationCap, label: 'Total Students', value: totalStudents },
    {
      icon: GraduationCap,
      label: 'Total Male Students',
      value: totalMaleStudents,
    },
    {
      icon: GraduationCap,
      label: 'Total Female Students',
      value: totalFemaleStudents,
    },
    { icon: Presentation, label: 'Total Classrooms', value: totalClassrooms },
    { icon: Briefcase, label: 'Total Teachers', value: totalTeachers },
  ];

  if (totalUsers) {
    overviews.push({ icon: Users, label: 'Total Users', value: totalUsers });
  }

  return {
    title: 'Dashboard',
    overviews,
    recentActivities,
  };
};
