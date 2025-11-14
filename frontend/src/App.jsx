import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ListaEntregas from "./pages/ListaEntregas";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/entregas" element={<ListaEntregas />} />
            </Routes>
        </BrowserRouter>
    );
}