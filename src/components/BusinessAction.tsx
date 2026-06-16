"use client";

import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ACOES_DISPONIVEIS = [
  "ABEV3",
  "ALOS3",
  "ALPA3",
  "ALPK3",
  "AMBP3",
  "AMER3",
  "ANIM3",
  "ARML3",
  "ASAI3",
  "AUAU3",
  "AXIA7",
  "AZZA3",
  "B3SA3",
  "BBDC3",
  "BBDC4",
  "BEEF3",
  "BEES4",
  "BLAU3",
  "BMOB3",
  "BOBR4",
  "BRAP4",
  "CEAB3",
  "CEPE5",
  "CESP3",
  "CGRA4",
  "CLSC3",
  "CMIN3",
  "CPLE3",
  "CRPG5",
  "CSMG3",
  "CSNA3",
  "CXSE3",
  "DASA3",
  "EGIE3",
  "ELEK4",
  "EMBJ3",
  "ENEV3",
  "ENGI3",
  "ENGI4",
  "ENMT3",
  "EQPA3",
  "EVEN3",
  "EZTC3",
  "FBMC3",
  "FESA4",
  "FIQE3",
  "GMAT3",
  "GOAU3",
  "HBOR3",
  "HYPE3",
  "INEP4",
  "IRBR3",
  "ITUB3",
  "JHSF3",
  "KLBN11",
  "KLBN4",
  "LJQQ3",
  "LREN3",
  "MGLU3",
  "MLAS3",
  "MTSA4",
  "OFSA3",
  "OIBR3",
  "OIBR4",
  "OSXB3",
  "PCAR3",
  "PETR3",
  "PINE14",
  "PLPL3",
  "POMO4",
  "PRIO3",
  "PRNR3",
  "RADL3",
  "RANI3",
  "RECV3",
  "RENT3",
  "RIAA3",
  "ROMI3",
  "SBFG3",
  "SHUL4",
  "SIMH3",
  "SMFT3",
  "SMTO3",
  "SUZB3",
  "SYNE3",
  "TAEE11",
  "TASA4",
  "TECN3",
  "TELB3",
  "TIMS3",
  "TOTS3",
  "TPIS3",
  "TUPY3",
  "USIM3",
  "USIM5",
  "VALE3",
  "VAMO3",
  "VIVA3",
  "WDCN3",
  "WLMM4",
  "YDUQ3",
];

const FIIS_DISPONIVEIS = [
  "ABCP11",
  "ADSH11",
  "AFHF11",
  "AFHI11",
  "AIEC11",
  "AJFI11",
  "ALMI11",
  "ALZC11",
  "ALZM11",
  "ALZR11",
  "ANCR11B",
  "APTO11",
  "APXM11",
  "APXR11",
  "APXU11",
  "AQLL11",
  "ARFI11B",
  "AROA11",
  "ARRI11",
  "ARTE11",
  "ARXD11",
  "ASRF11",
  "ATCR11",
  "ATSA11",
  "ATWN11",
  "AURB11",
  "AZPE11",
  "AZPL11",
  "BARI11",
  "BBFI11",
  "BBFO11",
  "BBIG11",
  "BBIM11",
  "BBRC11",
  "BCFF11",
  "BCIA11",
  "BCRI11",
  "BETW11",
  "BGRB11",
  "BICE11",
  "BICR11",
  "BIME11",
  "BINR11",
  "BIPD11",
  "BIPE11",
  "BLCA11",
  "BLCP11",
  "BLMC11",
  "BLMG11",
  "BLMO11",
  "BLMR11",
  "BLOG11",
  "BLUR11",
  "BMII11",
  "BMLC11",
  "BNFS11",
  "BPFF11",
  "BPLC11",
  "BPML11",
  "BPRP11",
  "BRCO11",
  "BRCR11",
  "BREV11",
  "BRHT11B",
  "BRIM11",
  "BRIP11",
  "BROF11",
  "BROL11",
  "BRSE11",
  "BSLT11",
  "BTAL11",
  "BTCI11",
  "BTCR11",
  "BTHF11",
  "BTHI11",
  "BTHI12",
  "BTHR11",
  "BTLG11",
  "BTML11",
  "BTRA11",
  "BTSG11",
  "BTSI11",
  "BTWR11",
  "BTYU11",
  "BVAR11",
  "BZEL11",
  "BZLI11",
  "CACR11",
  "CARE11",
  "CBOP11",
  "CCLB11",
  "CCME11",
  "CCRF11",
  "CCVA11",
  "CENU11",
  "CEOC11",
  "CFHI11",
  "CFII11",
  "CIXM11",
  "CIXR11",
  "CJCT11",
  "CJFI11",
  "CLIN11",
  "CNES11",
  "COPP11",
  "CPFF11",
  "CPFO11",
  "CPHH11",
  "CPLG11",
  "CPOF11",
  "CPSH11",
  "CPTS11",
  "CPUR11",
  "CRFF11",
  "CSMC11",
  "CTEM11",
  "CTNP11",
  "CTXT11",
  "CVPR11",
  "CXAG11",
  "CXCE11",
  "CXCI11",
  "CXCO11",
  "CXRI11",
  "CXTL11",
  "CYCR11",
  "CYLD11",
  "DAMA11",
  "DAMT11B",
  "DAYM11",
  "DEVA11",
  "DLMT11",
  "DMAC11",
  "DOMC11",
  "DOVL11B",
  "DPRO11",
  "DRIT11",
  "DVFF11",
  "DVLP11",
  "DVLT11",
  "EAGL11",
  "EDFO11",
  "EDGA11",
  "EDGE11",
  "EGDB11",
  "EGYR11",
  "EIRA11",
  "ELDO11",
  "EMET11",
  "EQIR11",
  "ERCR11",
  "ERPA11",
  "ESTQ11",
  "EURO11",
  "EXES11",
  "FAED11",
  "FAGL11",
  "FAMB11",
  "FAOE11",
  "FARU11",
  "FATN11",
  "FCAS11",
  "FCFL11",
  "FGPM11",
  "FIGS11",
  "FIIB11",
  "FIIC11",
  "FIIP11",
  "FINF11",
  "FISC11",
  "FISD11",
  "FIVN11",
  "FLCR11",
  "FLFL11",
  "FLMA11",
  "FLNR11",
  "FLRP11",
  "FMOF11",
  "FOFT11",
  "FPAB11",
  "FPNG11",
  "FRHY11",
  "FTCE11B",
  "FVBI11",
  "FVPQ11",
  "FYTO11",
  "GAME11",
  "GARE11",
  "GCDL11",
  "GCFF11",
  "GCOI11",
  "GCRI11",
  "GESE11B",
  "GFDL11",
  "GGRC11",
  "GLCR11",
  "GLOG11",
  "GLPF11",
  "GLPL11",
  "GRLV11",
  "GRUL11",
  "GSFI11",
  "GTLG11",
  "GTWR11",
  "GURB11",
  "GVBI11",
  "GZIT11",
  "HAAA11",
  "HABT11",
  "HBCR11",
  "HBTT11",
  "HCHG11",
  "HCPR11",
  "HCRI11",
  "HCST11",
  "HCTR11",
  "HDEL11",
  "HDOF11",
  "HFOF11",
  "HGBL11",
  "HGBS11",
  "HGCR11",
  "HGFF11",
  "HGIC11",
  "HGLG11",
  "HGPO11",
  "HGRE11",
  "HGRS11",
  "HGRU11",
  "HILG11",
  "HIRE11",
  "HLMB11",
  "HLOG11",
  "HMOC11",
  "HOFC11",
  "HOMS11",
  "HOSI11",
  "HPDP11",
  "HPDR11",
  "HRDF11",
  "HREC11",
  "HRES11",
  "HSAF11",
  "HSLG11",
  "HSML11",
  "HSRE11",
  "HTMX11",
  "HUCG11",
  "HUSC11",
  "HUSI11",
  "HYPI11",
  "IBBP11",
  "IBCR11",
  "IBFF11",
  "ICNE11",
  "ICRI11",
  "IDFI11",
  "IDGR11",
  "IDUA11",
  "IMOV11",
  "INDE11",
  "INLG11",
  "INRD11",
  "IRDM11",
  "IRIM11",
  "ISCJ11",
  "ITIP11",
  "ITIT11",
  "ITRI11",
  "IVCI11",
  "JASC11",
  "JBFO11",
  "JCCJ11",
  "JCDA11",
  "JCDB11",
  "JCIN11",
  "JFLL11",
  "JPPA11",
  "JPPC11",
  "JRDM11",
  "JSAF11",
  "JSCR11",
  "JSRE11",
  "JTPR11",
  "KCRE11",
  "KEVE11",
  "KFEN11",
  "KFOF11",
  "KINP11",
  "KISU11",
  "KIVO11",
  "KLOG11",
  "KNCR11",
  "KNHF11",
  "KNHY11",
  "KNIP11",
  "KNPR11",
  "KNRE11",
  "KNRI11",
  "KNSC11",
  "KNUQ11",
  "KOPI11",
  "KORE11",
  "KRES11",
  "LASC11",
  "LATR11B",
  "LAVF11",
  "LFTT11",
  "LIFE11",
  "LKDV11",
  "LLAO11",
  "LMAI11",
  "LOFT11B",
  "LPLP11",
  "LRDI11",
  "LRED11",
  "LSOI11",
  "LSPA11",
  "LTMT11",
  "LVBI11",
  "MADS11",
  "MANA11",
  "MATV11",
  "MAXR11",
  "MCCI11",
  "MCEM11",
  "MCHF11",
  "MCLO11",
  "MCRE11",
  "MFAI11",
  "MFCR11",
  "MFII11",
  "MGCR11",
  "MGFF11",
  "MGHT11",
  "MGIM11",
  "MGLC11",
  "MGRI11",
  "MINT11",
  "MMPD11",
  "MMVE11",
  "MOFF11",
  "MORC11",
  "MORE11",
  "MOSO11",
  "MTOF11",
  "MTRS11",
  "MVFI11",
  "MXRF11",
  "N4V1",
  "N4V111",
  "NAUI11",
  "NAVT11",
  "NCRI11",
  "NEWL11",
  "NEWU11",
  "NIVT11",
  "NPAR11",
  "NSLU11",
  "NVHO11",
  "NVIF11",
  "OBAL11",
  "OCRE11",
  "OGHY11",
  "ONDA11",
  "ONEF11",
  "OPTM11",
  "ORPD11",
  "OUFF11",
  "OUJP11",
  "OURE11",
  "PABY11",
  "PATA11",
  "PATB11",
  "PATC11",
  "PATL11",
  "PBLV11",
  "PCAS11",
  "PCIP11",
  "PDBM11",
  "PEMA11",
  "PLAG11",
  "PLCR11",
  "PLRI11",
  "PMFO11",
  "PMIS11",
  "PMLL11",
  "PMRL11",
  "PNCR11",
  "PNDL11",
  "PNLN11",
  "PNPR11",
  "PNRC11",
  "PORD11",
  "PQAG11",
  "PQDP11",
  "PRSN11B",
  "PRSV11",
  "PRTS11",
  "PRZS11",
  "PSEC11",
  "PULV11",
  "PVBI11",
  "QAMI11",
  "QIRI11",
  "QNTS11",
  "QTZD11",
  "RBBV11",
  "RBCB11",
  "RBDS11",
  "RBED11",
  "RBFM11",
  "RBFY11",
  "RBGS11",
  "RBHG11",
  "RBHY11",
  "RBIR11",
  "RBLG11",
  "RBOP11",
  "RBRD11",
  "RBRF11",
  "RBRI11",
  "RBRK11",
  "RBRL11",
  "RBRM11",
  "RBRP11",
  "RBRR11",
  "RBRS11",
  "RBRU11",
  "RBRX11",
  "RBRY11",
  "RBTS11",
  "RBVA11",
  "RBVO11",
  "RCFA11",
  "RCFF11",
  "RCKF11",
  "RCRB11",
  "RCRI11",
  "RCRI11B",
  "RDCI11",
  "RDIV11",
  "RDLI11",
  "RDLS11",
  "RECD11",
  "RECH11",
  "RECM11",
  "RECR11",
  "RECT11",
  "RECX11",
  "REIT11",
  "RELG11",
  "RENV11",
  "RFOF11",
  "RINV11",
  "RJDA11",
  "RMBS11",
  "RNDP11",
  "RNGO11",
  "ROOF11",
  "RPRI11",
  "RSPD11",
  "RTEL11",
  "RZAK11",
  "RZAT11",
  "RZDM11",
  "RZLC11",
  "RZTR11",
  "RZZI11",
  "RZZR11",
  "RZZV11",
  "SACL11",
  "SADI11",
  "SAIC11B",
  "SALI11",
  "SAPI11",
  "SARE11",
  "SBCL11",
  "SCPF11",
  "SEED11",
  "SEQR11",
  "SFND11",
  "SFRO11",
  "SHDP11B",
  "SHOP11",
  "SHPH11",
  "SHPP11",
  "SHSO11",
  "SIGR11",
  "SJAU11",
  "SLDZ11",
  "SMRE11",
  "SNCI11",
  "SNEL11",
  "SNFF11",
  "SNLG11",
  "SNME11",
  "SOFF11",
  "SOLR11",
  "SPAF11",
  "SPDE11",
  "SPGM11",
  "SPMO11",
  "SPTW11",
  "SPVJ11",
  "SPXC11",
  "SPXG11",
  "SPXL11",
  "SPXS11",
  "SRVD11",
  "STRX11",
  "SURE11",
  "TBOF11",
  "TCIN11",
  "TCPF11",
  "TELD11",
  "TELF11",
  "TELM11",
  "TEPP11",
  "TFOF11",
  "TGAR11",
  "THRA11",
  "TJKB11",
  "TMPS11",
  "TOPP11",
  "TORD11",
  "TORM13",
  "TOUR11",
  "TRBL11",
  "TRNT11",
  "TRPL11",
  "TRUE11",
  "TRXB11",
  "TRXF11",
  "TRXY11",
  "TSER11",
  "TSNC11",
  "TSNM11",
  "TVRI11",
  "URHF11",
  "URPR11",
  "VCHG11",
  "VCJR11",
  "VCRI11",
  "VCRR11",
  "VCTH11",
  "VDSV11",
  "VERE11",
  "VGHF11",
  "VGII11",
  "VGIP11",
  "VGIR11",
  "VGRI11",
  "VIDS11",
  "VIFI11",
  "VILG11",
  "VINO11",
  "VISC11",
  "VIUR11",
  "VJFD11",
  "VLIQ11",
  "VLJS11",
  "VLOL11",
  "VOTS11",
  "VPPR11",
  "VPSI11",
  "VRTA11",
  "VRTM11",
  "VSEC11",
  "VSHO11",
  "VSLH11",
  "VTBL11",
  "VTLT11",
  "VTPA11",
  "VTPL11",
  "VTRT11",
  "VTVI11",
  "VTXI11",
  "VVCO11",
  "VVCR11",
  "VVMR11",
  "VVPR11",
  "VVRI11",
  "VXXV11",
  "WHGR11",
  "WPLZ11",
  "WSEC11",
  "WTSP11",
  "XBXO11",
  "XLPR11",
  "XPCI11",
  "XPCM11",
  "XPIN11",
  "XPLG11",
  "XPML11",
  "XPRE11",
  "XPSF11",
  "YEES11",
  "YUFI11",
  "ZAGH11",
  "ZAVC11",
  "ZAVI11",
  "ZIFI11",
];

// Mock da carteira do usuário — substitua por dados reais via props/API
const CARTEIRA_ACOES: string[] = ["PETR3", "VALE3", "ITUB3", "BBDC4", "ABEV3"];
const CARTEIRA_FIIS: string[] = ["MXRF11", "HGLG11", "KNRI11", "XPLG11"];
const CARTEIRA_RENDA_FIXA: string[] = [
  "Tesouro Selic 2029",
  "CDB Banco Inter 115% CDI",
  "LCI Bradesco 2026",
];

// Tipos de Operação e Investimento

type OperationType = "compra" | "venda";
type InvestmentType = "acoes" | "fiis" | "renda-fixa" | "";

// Formatação de moeda para BRL

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Componente exportação

export default function BusinessAction() {
  const [operacao, setOperacao] = useState<OperationType>("compra");
  const [investimento, setInvestimento] = useState<InvestmentType>("");

  // Ações / FIIs
  const [ticker, setTicker] = useState("");
  const [tickerSearch, setTickerSearch] = useState("");
  const [quantidade, setQuantidade] = useState<string>("");
  const [valor, setValor] = useState<string>("");

  // Renda Fixa
  const [nomeRendaFixa, setNomeRendaFixa] = useState("");
  const [totalRendaFixa, setTotalRendaFixa] = useState<string>("");

  // Ações
  const [empresa, setEmpresa] = useState("");

  // Fundos Imobiliários
  const [categoria, setCategoria] = useState("");
  const CATEGORIAS_FII = ["Fundo de Papel", "Fundo de Tijolo", "Fundo Híbrido"];

  // Cálculo do total para ações/FIIs
  const total = useMemo(() => {
    const q = parseFloat(quantidade);
    const v = parseFloat(valor.replace(",", "."));
    return !isNaN(q) && !isNaN(v) ? q * v : 0;
  }, [quantidade, valor]);

  const listaDisponivel = useMemo(() => {
    if (investimento === "acoes")
      return operacao === "compra" ? ACOES_DISPONIVEIS : CARTEIRA_ACOES;
    if (investimento === "fiis")
      return operacao === "compra" ? FIIS_DISPONIVEIS : CARTEIRA_FIIS;
    return [];
  }, [investimento, operacao]);

  const listaFiltrada = useMemo(() => {
    if (!tickerSearch) return listaDisponivel;
    return listaDisponivel.filter((t) =>
      t.toLowerCase().includes(tickerSearch.toLowerCase()),
    );
  }, [listaDisponivel, tickerSearch]);

  function handleOperacaoChange(value: string) {
    setOperacao(value as OperationType);
    resetFields();
  }

  function handleInvestimentoChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setInvestimento(e.target.value as InvestmentType);
    resetFields();
  }

  function resetFields() {
    setTicker("");
    setTickerSearch("");
    setQuantidade("");
    setValor("");
    setNomeRendaFixa("");
    setTotalRendaFixa("");
    setEmpresa("");
    setCategoria("");
  }

  function handleConfirmar() {
      console.log({
        operacao,
        investimento,
        ticker: investimento !== "renda-fixa" ? ticker : undefined,
        nome: investimento === "renda-fixa" ? nomeRendaFixa : undefined,
        quantidade: investimento !== "renda-fixa" ? quantidade : undefined,
        valor: investimento !== "renda-fixa" ? valor : undefined,
        total: investimento !== "renda-fixa" ? total : totalRendaFixa,
        empresa:
          investimento === "acoes" && operacao === "compra"
            ? empresa
            : undefined,
        categoria:
          investimento === "fiis" && operacao === "compra"
            ? categoria
            : undefined,
      });
    }

  const isRendaFixa = investimento === "renda-fixa";
  const isAcoesOuFiis = investimento === "acoes" || investimento === "fiis";
  const labelTicker = investimento === "fiis" ? "Fundo Imobiliário" : "Ação";
  const canConfirm =
    investimento !== "" &&
    (isRendaFixa
      ? nomeRendaFixa.trim() !== "" && totalRendaFixa !== ""
      : ticker !== "" &&
        quantidade !== "" &&
        valor !== "" &&
        (investimento === "acoes" && operacao === "compra"
          ? empresa.trim() !== ""
          : true) &&
        (investimento === "fiis" && operacao === "compra"
          ? categoria !== ""
          : true));

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 items-center">
      {/* Cabeçalho */}
      <div className="flex w-full flex-col items-center gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Comprar / Vender
        </h1>
        <p className="text-sm text-muted-foreground/60">
          Registre suas operações de compra e venda de ativos
        </p>
      </div>
      <div className="w-full h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />

      <Card className="w-full max-w-xl border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="items-center text-center px-6 pt-6 pb-4">
          <CardTitle className="text-lg font-bold text-foreground">
            Operação de Investimento
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 px-6 pb-6">
          {/* ── Tabs Compra / Venda ── */}
          <Tabs
            value={operacao}
            onValueChange={handleOperacaoChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-muted/40 border border-border/40">
              <TabsTrigger
                value="compra"
                className="data-[state=active]:bg-emerald-950/60 data-[state=active]:text-emerald-400 data-[state=active]:border data-[state=active]:border-emerald-800/50"
              >
                <TrendingUp className="mr-1.5 h-4 w-4" />
                Compra
              </TabsTrigger>
              <TabsTrigger
                value="venda"
                className="data-[state=active]:bg-rose-950/60 data-[state=active]:text-rose-400 data-[state=active]:border data-[state=active]:border-rose-800/50"
              >
                <TrendingDown className="mr-1.5 h-4 w-4" />
                Venda
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* ── Tipo de investimento ── */}
          <Field>
            <FieldLabel
              htmlFor="investimento"
              className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
            >
              Tipo de Investimento
            </FieldLabel>
            <NativeSelect
              id="investimento"
              className="w-full bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
              value={investimento}
              onChange={handleInvestimentoChange}
            >
              <NativeSelectOption value="">
                Selecione o investimento
              </NativeSelectOption>
              <NativeSelectOption value="acoes">Ações</NativeSelectOption>
              <NativeSelectOption value="fiis">
                Fundos Imobiliários
              </NativeSelectOption>
              <NativeSelectOption value="renda-fixa">
                Renda Fixa
              </NativeSelectOption>
            </NativeSelect>
          </Field>

          {/* ── Ações ou FIIs ── */}
          {isAcoesOuFiis && (
            <Field>
              <FieldLabel
                htmlFor="ticker"
                className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
              >
                {operacao === "compra"
                  ? `Selecionar ${labelTicker}`
                  : `${labelTicker} da Carteira`}
              </FieldLabel>

              {operacao === "compra" && (
                <div className="relative mb-1">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                  <Input
                    placeholder={`Buscar ${labelTicker.toLowerCase()}...`}
                    className="pl-8 bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
                    value={tickerSearch}
                    onChange={(e) => setTickerSearch(e.target.value)}
                  />
                </div>
              )}

              <NativeSelect
                id="ticker"
                className="w-full bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
              >
                <NativeSelectOption value="">
                  {operacao === "compra"
                    ? `Escolha ${investimento === "fiis" ? "o fundo" : "a ação"}`
                    : listaFiltrada.length === 0
                      ? "Nenhum ativo na carteira"
                      : `Escolha ${investimento === "fiis" ? "o fundo" : "a ação"}`}
                </NativeSelectOption>
                {listaFiltrada.map((t) => (
                  <NativeSelectOption key={t} value={t}>
                    {t}
                  </NativeSelectOption>
                ))}
              </NativeSelect>

              {operacao === "compra" && tickerSearch && (
                <p className="mt-1 text-xs text-muted-foreground/50">
                  {listaFiltrada.length} resultado
                  {listaFiltrada.length !== 1 ? "s" : ""}
                </p>
              )}
            </Field>
          )}

          {/* ── Empresa (Ações - Compra) ── */}
          {investimento === "acoes" && operacao === "compra" && (
            <Field>
              <FieldLabel
                htmlFor="empresa"
                className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
              >
                Empresa
              </FieldLabel>
              <Input
                id="empresa"
                placeholder="Ex: Petróleo Brasileiro S.A."
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                className="bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
              />
            </Field>
          )}

          {/* ── Categoria (FIIs - Compra) ── */}
          {investimento === "fiis" && operacao === "compra" && (
            <Field>
              <FieldLabel
                htmlFor="categoria"
                className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
              >
                Categoria
              </FieldLabel>
              <NativeSelect
                id="categoria"
                className="w-full bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <NativeSelectOption value="">
                  Escolha a categoria
                </NativeSelectOption>
                {CATEGORIAS_FII.map((c) => (
                  <NativeSelectOption key={c} value={c}>
                    {c}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
          )}

          {/* ── Renda Fixa — Compra: nome livre ── */}
          {isRendaFixa && operacao === "compra" && (
            <Field>
              <FieldLabel
                htmlFor="nome-rf"
                className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
              >
                Nome do Investimento
              </FieldLabel>
              <Input
                id="nome-rf"
                placeholder="Ex: CDB Banco Inter 115% CDI"
                value={nomeRendaFixa}
                onChange={(e) => setNomeRendaFixa(e.target.value)}
                className="bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
              />
            </Field>
          )}

          {/* ── Renda Fixa — Venda: lista da carteira ── */}
          {isRendaFixa && operacao === "venda" && (
            <Field>
              <FieldLabel
                htmlFor="rf-carteira"
                className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
              >
                Renda Fixa da Carteira
              </FieldLabel>
              <NativeSelect
                id="rf-carteira"
                className="w-full bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
                value={nomeRendaFixa}
                onChange={(e) => setNomeRendaFixa(e.target.value)}
              >
                <NativeSelectOption value="">
                  {CARTEIRA_RENDA_FIXA.length === 0
                    ? "Nenhum ativo na carteira"
                    : "Escolha o investimento"}
                </NativeSelectOption>
                {CARTEIRA_RENDA_FIXA.map((item) => (
                  <NativeSelectOption key={item} value={item}>
                    {item}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
          )}

          {/* ── Campos de valor: Ações / FIIs ── */}
          {isAcoesOuFiis && (
            <FieldGroup className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel
                  htmlFor="quantidade"
                  className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
                >
                  Quantidade
                </FieldLabel>
                <Input
                  id="quantidade"
                  type="number"
                  min={1}
                  placeholder="0"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  className="bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
                />
              </Field>
              <Field>
                <FieldLabel
                  htmlFor="valor"
                  className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
                >
                  Valor Unitário (R$)
                </FieldLabel>
                <Input
                  id="valor"
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
                />
              </Field>
              <Field className="md:col-span-2">
                <FieldLabel
                  htmlFor="total"
                  className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
                >
                  Total
                </FieldLabel>
                <Input
                  id="total"
                  readOnly
                  value={total > 0 ? formatBRL(total) : ""}
                  placeholder="R$ 0,00"
                  className="bg-muted/20 border-border/30 text-chart-1 font-bold cursor-default"
                />
              </Field>
            </FieldGroup>
          )}

          {/* ── Campos de valor: Renda Fixa ── */}
          {isRendaFixa && (
            <Field>
              <FieldLabel
                htmlFor="total-rf"
                className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
              >
                Valor Total (R$)
              </FieldLabel>
              <Input
                id="total-rf"
                type="number"
                min={0}
                step={0.01}
                placeholder="0,00"
                value={totalRendaFixa}
                onChange={(e) => setTotalRendaFixa(e.target.value)}
                className="bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
              />
            </Field>
          )}

          {/* ── Botão ── */}
          <Button
            className={`w-full font-semibold shadow-lg transition-all duration-200 ${
              operacao === "compra"
                ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40"
                : "bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-40"
            }`}
            disabled={!canConfirm}
            onClick={handleConfirmar}
          >
            Confirmar {operacao === "compra" ? "Compra" : "Venda"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
