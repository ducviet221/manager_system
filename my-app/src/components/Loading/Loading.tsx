import { createContext, useContext, useState } from "react";

interface ILoadingContext {
  isLoading: boolean;
  showLoading: VoidFunction;
  closeLoading: VoidFunction;
}

const loadingContext = createContext<ILoadingContext>({
  isLoading: false,
  showLoading: () => 1,
  closeLoading: () => 1,
});

interface ILoadingProvide {
  children?: React.ReactNode;
}
export const LoadingProvide = ({ children }: ILoadingProvide) => {
  const [loading, setLoading] = useState(false);
  const showLoading = () => {
    setLoading(true);
  };
  const closeLoading = () => {
    setLoading(false);
  };

  return (
    <loadingContext.Provider value={{ isLoading: loading, showLoading, closeLoading }}>
      {children}
    </loadingContext.Provider>
  );
};

export const LoadingConsumer = loadingContext.Consumer;

export const useLoading = () => useContext(loadingContext);
