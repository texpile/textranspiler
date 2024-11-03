# Texpile Transpiler

LICENSES: AGPL

Translates ProseMirror JSON into LaTeX according to templates

input:
```json
{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"\t\"Welcome to the Texpile MLA compiler! Your documents will be automatically converted into MLA format. Remember, you can easily add citations using the citation manager in the bottom right corner.\""}]}]}
```
output(MLA):
```tex
\documentclass[12pt]{article}
\usepackage[american]{babel}
\usepackage{csquotes}
\usepackage[style=mla,backend=biber]{biblatex}
\usepackage[letterpaper,top=1.0in,bottom=1.0in,left=1.0in,right=1.0in]{geometry}
\usepackage{times}
\usepackage{setspace}
\usepackage{rotating}
\usepackage{fancyhdr}
\usepackage[utf8]{inputenc}
\usepackage{tabularx}
\usepackage{amsmath}
\usepackage{graphicx}
\usepackage{xcolor}
\doublespacing
\pagestyle{fancy}
\lhead{}
\chead{}
\rhead{ \thepage}
\lfoot{}
\cfoot{}
\rfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}
\setlength\headsep{0.333in}
\newcommand{\bibent}{\noindent\hangindent 40pt}
\newenvironment{workscited}{\newpage\begin{center}Works Cited\end{center}}{\newpage}
\renewcommand{\maketitle}{\makemlaheader}
\newcommand{\makemlaheader}{ \\  \\  \\ \today\\\begin{center}\textnormal{Untitled}\end{center}}
\addbibresource{references.bib}
\setlength{\parindent}{0.5in}

\begin{document}
\noindent Anonymous\\Unknown\\Unknown\\\today\\
\begin{center}\textnormal{Untitled}\end{center}
\begin{flushleft}

\hspace{0.5in}"Welcome to the Texpile MLA compiler! Your documents will be automatically converted into MLA format. Remember, you can easily add citations using the citation manager in the bottom right corner."

\end{flushleft}
\begin{workscited}\printbibliography[heading=none]\end{workscited}
\end{document}
```