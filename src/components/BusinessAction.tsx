import { AppWindowIcon, CodeIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BusinessAction() {
  return (
    <Card className="w-full max-w-xl shadow-sm">
      <CardHeader className="items-center text-center">
        <CardTitle>Compra e venda</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <TabsIcons />
        <NativeSelectDemo />
        <InputGrid />
        <Button className="w-full">Confirmar Ordem</Button>
      </CardContent>
    </Card>
  );
}

function TabsIcons() {
  return (
    <Tabs defaultValue="preview" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="preview">
          <AppWindowIcon />
          Compra
        </TabsTrigger>
        <TabsTrigger value="code">
          <CodeIcon />
          Venda
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

function NativeSelectDemo() {
  return (
    <div className="grid w-full grid-rows-1 gap-4 md:grid-cols-2">
      <NativeSelect className="w-full">
        <NativeSelectOption value="">Selecione o Investimento</NativeSelectOption>
        <NativeSelectOption value="acoes">Ações</NativeSelectOption>
        <NativeSelectOption value="fiis">Fundos imobiliários</NativeSelectOption>
        <NativeSelectOption value="renda-fixa">Renda Fixa</NativeSelectOption>
      </NativeSelect>
          <NativeSelect className="w-full">
        <NativeSelectOption value="">Selecione o Investimento</NativeSelectOption>
        <NativeSelectOption value="acoes">Ações</NativeSelectOption>
        <NativeSelectOption value="fiis">Fundos imobiliários</NativeSelectOption>
        <NativeSelectOption value="renda-fixa">Renda Fixa</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}

function InputGrid() {
  return (
    <FieldGroup className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="quantidade">Quantidade</FieldLabel>
          <Input id="first-name" type="number" placeholder="0" />
        </Field>
        <Field>
          <FieldLabel htmlFor="valor">Valor</FieldLabel>
          <Input id="last-name" type="number" placeholder="R$ 0,00" />
        </Field>
      <Field className="md:col-span-2">
        <FieldLabel htmlFor="valor">Total</FieldLabel>
        <Input id="last-name" type="number" placeholder="R$ 0,00" />
      </Field>
    </FieldGroup>
  );
}
