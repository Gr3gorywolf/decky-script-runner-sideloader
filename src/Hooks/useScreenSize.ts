import { useMediaQuery } from "react-responsive";

export const useScreenSize = () => {
    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 1281px)',
    });

    return { isDesktopOrLaptop }
}