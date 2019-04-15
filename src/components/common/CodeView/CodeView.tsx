import React, { Component } from "react";
import { WriteConsumer } from "../../../contexts/writeContext";
import marked from "marked";
import "./codeView.css";

// prism 관련 코드 불러오기
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
require("prismjs/components/prism-bash.min.js");
require("prismjs/components/prism-javascript.min.js");
require("prismjs/components/prism-jsx.min.js");
require("prismjs/components/prism-css.min.js");

interface Props {
  type: string;
  markdown: string;
  setValue?: any;
}
interface State {
  html: string;
}

export class Code extends Component<Props, State> {
  constructor(props) {
    super(props);
    const { markdown } = props;
    // 서버사이드 렌더링에서도 마크다운 처리가 되도록 constructor 쪽에서도 구현합니다.
    this.state = {
      html: markdown
        ? marked(props.markdown, { breaks: true, sanitize: true })
        : ""
    };
  }
  _renderMarkdown = () => {
    const { markdown } = this.props;
    // 마크다운이 존재하지 않는다면 공백처리
    if (!markdown) {
      this.setState({ html: "" });
      return;
    }
    this.setState({
      html: marked(markdown, {
        breaks: true, // 일반 엔터로 새 줄 입력
        sanitize: true // 마크다운 내부 html 무시
      })
    });
  };

  componentDidUpdate(prevProps, prevState) {
    // markdown 값이 변경되면 renderMarkdown을 호출합니다.
    if (prevProps.markdown !== this.props.markdown) {
      this._renderMarkdown();
    }
    // console.log(prevProps, prevState);
    // state가 바뀌면 코드 하이라이팅
    if (prevState.html !== this.state.html) {
      Prism.highlightAll();
    }
  }

  componentDidMount() {
    Prism.highlightAll();
  }

  render() {
    const { html } = this.state;
    const { type } = this.props;

    // React 에서 html 을 렌더링 하려면 객체를 만들어서 내부에
    // __html 값을 설정해야합니다.
    const markup = {
      __html: html
    };

    // 그리고, dangerouslySetInnerHTML 값에 해당 객체를 넣어주면 됩니다.
    return (
      <div className={`codeView ${type}`} dangerouslySetInnerHTML={markup} />
    );
  }
}

const CodeView = () => (
  <WriteConsumer>
    {({ state, actions }: any) => {
      return (
        <Code markdown={state.value} setValue={actions.setValue} type="write" />
      );
    }}
  </WriteConsumer>
);

export default CodeView;
