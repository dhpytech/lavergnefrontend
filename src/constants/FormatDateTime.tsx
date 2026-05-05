import {useState} from "react";

const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getActiveMonth = () => {
    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);

    return {
        startDate: getFormattedDate(firstDayOfYear),
        endDate: getFormattedDate(now),
    };
};
