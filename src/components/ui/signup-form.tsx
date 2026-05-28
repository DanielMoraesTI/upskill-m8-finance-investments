import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface SignupFormProps extends React.ComponentProps<"div"> {
  onLoginClick?: () => void;
}

export function SignupForm({
  className,
  onLoginClick,  
  ...props }: SignupFormProps) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Crie sua conta</CardTitle>
        <CardDescription>
          Informe seus dados abaixo para criar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
              <Input id="name" type="text" placeholder="John Doe" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="nome@examplo.com"
                required
              />
              <FieldDescription>
                Utilizaremos esta informação para entrar em contato. Seu e-mail não será compartilhado com terceiros.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <Input id="password" type="password" required />
              <FieldDescription>
                Deve ter pelo menos 8 caracteres.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirmar Senha
              </FieldLabel>
              <Input id="confirm-password" type="password" required />
              <FieldDescription>Por favor, confirme sua senha</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Criar conta</Button>
                <Button variant="outline" type="button">
                  Entrar com o Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Já possui uma conta?{" "}
                  <button
                    type="button"
                    className="text-blue-500 hover:underline"
                    onClick={onLoginClick}
                  >
                    Faça login
                  </button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
