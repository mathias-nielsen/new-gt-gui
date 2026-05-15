import { Navigate, Route, Routes } from "react-router-dom";
import { TopNavigation } from "./components/TopNavigation";
import LandingPage from "./pages/LandingPage";
import TownPage from "./pages/TownPage";
import TownRigsPage from "./pages/TownOutlets/TownRigsPage";
import TownMayorPage from "./pages/TownOutlets/TownMayorPage";

export default function App() {
    return (
        <>
            <TopNavigation />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/town" element={<TownPage />}>
                    <Route index element={<Navigate to="mayor" replace />} />
                    <Route path="mayor" element={<TownMayorPage />} />
                    <Route path="rigs" element={<TownRigsPage />} />
                </Route>
            </Routes>
        </>
    );
}
