import stat1 from "../assets/stats/stat-1.png";
import stat2 from "../assets/stats/stat-2.png";
import stat3 from "../assets/stats/stat-3.png";
import stat4 from "../assets/stats/stat-4.png";

export const stats = [
    {
        value: 12000,
        suffix: "+",
        label: "Active learners",
        icon: "Compass",
        image: stat3,
    },
    {
        value: 120,
        suffix: "+",
        label: "Expert mentors",
        icon: "Users",
        image: stat1,
        imageClassName: "object-cover object-right-bottom",
    },
    {
        value: 8000,
        suffix: "+",
        label: "Certificates issued",
        icon: "Award",
        image: stat2,
    },
    {
        value: 4.8,
        suffix: "/5",
        label: "Avg learner rating",
        decimals: 1,
        icon: "Star",
        image: stat4,
    },
];
