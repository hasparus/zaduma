
export type ColorScheme = "light" | "dark" | "fav" | null  /* system */;

// const setClass = (isDark: boolean) => document.documentElement.classList.toggle("dark", isDark);

export const setScheme = (scheme: ColorScheme): void => {
  
  const themeSelector = document.documentElement;
  const validThemes = ["light", "dark", "fav", null];

  // Remove all valid theme classes
  themeSelector.classList.remove(...validThemes);

  
  if(scheme === null){
    localStorage.removeItem("selectedTheme");
    let mediaQueryObj = window.matchMedia('(prefers-color-scheme: dark)');
    let isDarkMode = mediaQueryObj.matches; 
    if(isDarkMode){
      themeSelector.classList.add("dark");
    }
    else{
      themeSelector.classList.add("light");
    }
    
  }

  // Add the selected theme class
  if (validThemes.includes(scheme)) {
    themeSelector.classList.add(scheme);
    localStorage.setItem("selectedTheme", scheme); // Store the selected theme in local storage
  }
};




// export const setScheme = (scheme: ColorScheme): void => {

//   const themeSelector = document.documentElement;

//   themeSelector.classList.remove("dark","light","fav");

//   if(scheme === "light"){
//     themeSelector.classList.add("light");
//   }
//   else if(scheme === "dark"){
//     themeSelector.classList.add("dark");
//   }
//   else if(scheme === "fav"){
//     themeSelector.classList.add("fav");
//   }

// //   {
// //     let isDark: boolean;
// //     if (scheme) {
// //       if (window.ⲍ_schemeMql) window.ⲍ_schemeMql.onchange = null;

// //       isDark = scheme === "dark";
// //     } else {
// //       const mql = (window.ⲍ_schemeMql ||= window.matchMedia(
// //         "(prefers-color-scheme: dark)"
// //       ));

// //       mql.onchange = (e) => setClass(e.matches);
// //       isDark = mql.matches;
// //     }

// //     setClass(isDark);
// //   }

// //   if (typeof localStorage !== "undefined") {
// //     if (scheme) localStorage.setItem(STORAGE_KEY, scheme);
// //     else localStorage.removeItem(STORAGE_KEY);
// //   }

// };

// export const getStoredScheme = (): ColorScheme => {
//   if (typeof localStorage === "undefined") return null;
//   return localStorage.getItem(STORAGE_KEY) as ColorScheme;
// };

// Reading from localStorage and prefers-color-scheme
// and writing to documentElement.classList happens in InitializeColorScheme
// export const getEffectiveScheme = (): "dark" | "light" => {
//   return document.documentElement.classList.contains("dark") ? "dark" : "light";
// };

// declare global {
//   interface Window {
//     ⲍ_schemeMql?: MediaQueryList;
//   }
// }
