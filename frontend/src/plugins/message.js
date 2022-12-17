import { Toast } from "primereact/toast";
import React, { useRef, useImperativeHandle, forwardRef } from "react";

const Message = (props, ref) => {
  const toast = useRef(null);

  useImperativeHandle(ref, () => ({
    Success: (mensagem, titulo, timeout) => {
      Success(mensagem, titulo, timeout);
    },
    Info: (info, titulo, timeout) => {
      Info(info, titulo, timeout);
    },
    Warn: (warn, titulo, timeout) => {
      Warn(warn, titulo, timeout);
    },
    Error: (error, titulo, timeout) => {
      Error(error, titulo, timeout);
    },
    Clear: () => {
      Clear();
    },
  }));

  const Success = (mensagem, titulo = "Mensagem", timeout = 3000) => {
    toast.current.show({
      severity: "success",
      summary: titulo,
      detail: mensagem,
      life: timeout,
    });
  };

  const Info = (info, titulo = "Info", timeout = 3000) => {
    toast.current.show({
      severity: "info",
      summary: titulo,
      detail: info,
      life: timeout,
    });
  };

  const Warn = (warn, titulo = "Warn", timeout = 3000) => {
    toast.current.show({
      severity: "warn",
      summary: titulo,
      detail: warn,
      life: timeout,
    });
  };

  const Error = (error, titulo = "Error", timeout = 3000) => {
    toast.current.show({
      severity: "error",
      summary: titulo,
      detail: error,
      life: timeout,
    });
  };

  const Clear = () => {
    toast.current.clear();
  };

  return (
    <div>
      <Toast ref={toast} />
    </div>
  );
};

export default forwardRef(Message);
