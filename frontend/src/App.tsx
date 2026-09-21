import { Navigate, Route, Routes } from "react-router-dom";

import { ContatoPage } from "@/contato/ContatoPage";
import { PessoaPage } from "@/pessoa/PessoaPage";

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/pessoas" replace />} />
      <Route path="/pessoas" element={<PessoaPage />} />
      <Route path="/contatos" element={<ContatoPage />} />
      <Route path="/login" element={<Navigate to="/pessoas" replace />} />
    </Routes>
  );
}

export default App;
