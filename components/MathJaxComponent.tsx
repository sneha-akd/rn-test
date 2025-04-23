import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MathView, { MathText } from "react-native-math-view";

declare global {
  interface Window { // ⚠️ notice that "Window" is capitalized here
    MathJax: any;
  }
}

function MathJaxComponent({ children }: {
  children: React.ReactNode
}) {
  // const mathJaxRef = useRef<HTMLSpanElement | null>(null);
  const [latex, setLatex] = useState<string>('');

  useEffect(() => {
    // Assuming `children` is the LaTeX string that you want to display
    if (typeof children === 'string') {
      setLatex(children);
      console.log(children.trim());
    }
  }, [children]);

  // return <View><MathView math={latex} /></View>;
  return <Text>{latex}</Text>;
  // return <MathText
  //   value={latex}
  //   // math={latex}
  //   direction="ltr"
  //   CellRenderedComponent={<TouchableOpacity />}
  // />
}

export default MathJaxComponent;