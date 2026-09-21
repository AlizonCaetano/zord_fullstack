import { Navigate, Route, Routes } from "react-router-dom";

import { LoginPage } from "@/auth/LoginPage";
import { RotaProtegida } from "@/auth/RotaProtegida";
import { ContatoPage } from "@/contato/ContatoPage";
import { PessoaPage } from "@/pessoa/PessoaPage";
import { AppLayout } from "@/shared/AppLayout";

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RotaProtegida />}>
        <Route element={<AppLayout />}>
          <Route path="/pessoas" element={<PessoaPage />} />
          <Route path="/contatos" element={<ContatoPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/pessoas" replace />} />
    </Routes>
  );
}

export default App;
