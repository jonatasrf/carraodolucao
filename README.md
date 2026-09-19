# 🚗💨 Carrão do Lucão — Simulador Anti-Loss & Caçador de Bom Negócio

> **O aplicativo definitivo para o Lucas calcular financiamento de carro, desmascarar taxas escondidas de concessionária, comparar múltiplos cenários e descobrir qual negócio realmente vale a pena!**

Criado especialmente para rodar **100% no navegador (GitHub Pages)** e **otimizado para celular (Mobile-First)**, para o Lucas poder usar em pé dentro da loja ou concessionária enquanto negocia com o vendedor.

---

## ✨ Funcionalidades Principais

### 1. 🧮 Calculadora Bidirecional Inteligente
- **Descobrir Parcela (PMT)**: Lucas informa o preço do carro, entradas, prazo e taxa $\rightarrow$ o app calcula a parcela exata.
- **Descobrir Taxa Real / CET (Newton-Raphson)**: O vendedor diz *"só R$ 2.180 por mês em 48x"*. O Lucas digita e o app revela a taxa de juros real escondida e o total de juros abusivos.
- **Descobrir Preço Máximo do Carro**: O Lucas sabe quanto cabe na parcela mensal e quanto tem de entrada $\rightarrow$ o app calcula o valor teto do carro novo que ele consegue comprar.
- **Descobrir Prazo**: Calcula em quantos meses quita com dada parcela.

### 2. 🔄 Troca do Usado & Entradas Combinadas
- Valor do carro usado na troca com comparativo em tempo real contra a **Tabela FIPE** (mostra se a loja está desvalorizando seu seminovo).
- Desconto automático de débitos/dívida restante no usado (se ainda houver financiamento ativo).
- Entrada em dinheiro / PIX.

### 3. 🔎 Custos Extras & Venda Casada
- Detalhamento de TAC (Taxa de Abertura de Crédito), IOF, Emplacamento/Despachante e Seguro Prestamista embutido.
- Opção de simular o impacto de financiar essas taxas (juros sobre juros) vs pagar à vista.

### 4. 📊 Comparador de Cenários & Ranking
- Salve quantos cenários quiser (salvos automaticamente no celular via `localStorage`).
- Destaques automáticos do **Melhor Negócio 🏆**, **Menor Parcela 💵**, **Menor Juros Pago 📉** e **Maior Cilada 🚨**.
- Cálculo direto de economia: *"O Cenário A economiza R$ 18.400 em relação ao Cenário C"*.
- Ranking interativo ordenável por Custo Total, Parcela, Juros ou CET.

### 5. 😂 Humor Personalizado & Zoeiras do Lucão
- Veredictos automáticos baseados nas métricas reais da proposta:
  - 🚨 *Cilada Nível Marea Turbo Sem Óleo*
  - ⚠️ *Bolsa Banqueiro Confirmada*
  - 👀 *Dá pra Engolir, mas Dói o Bolso*
  - ⚖️ *Proposta Dentro da Média*
  - 🏆 *Selo Lucão de Inteligência Financeira*
- Presets prontos com clássicos automotivos (*Renegade de Shopping*, *Corolla de Vovô*, *Civic G10 Parcelado*).
- Chuva de confetes quando encontra um negócio que realmente vale a pena!

### 6. 📱 100% Mobile-First & Compartilhamento
- Teclados numéricos ajustados para toque no celular (`inputmode="decimal"`).
- Botão com 1 toque para gerar um resumo formatado direto para o **WhatsApp**.
- Exportação e importação de backup em `.JSON`.

---

## 🚀 Como Rodar Localmente

```bash
# 1. Instalar as dependências
npm install

# 2. Rodar o servidor de desenvolvimento
npm run dev

# 3. Testar a suíte matemática
node scripts/test-finance.mjs

# 4. Gerar a build de produção
npm run build
```

---

## 🌐 Como Publicar no GitHub Pages (Passo a Passo)

1. **Suba este projeto para um repositório no seu GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: Carrão do Lucão app completo"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/CarraodoLucao.git
   git push -u origin main
   ```

2. **Ative o GitHub Pages com GitHub Actions**:
   - No GitHub, acesse seu repositório $\rightarrow$ clique na aba **Settings** (Configurações).
   - No menu lateral esquerdo, clique em **Pages**.
   - Em **Build and deployment** $\rightarrow$ **Source**, selecione **GitHub Actions**.
   - Pronto! O workflow criado em `.github/workflows/deploy.yml` fará o build e publicará automaticamente seu app.
   - O link ficará disponível em: `https://SEU_USUARIO.github.io/CarraodoLucao/`

---

## 🛠️ Tecnologias Utilizadas

- **React 19** + **TypeScript**
- **Vite** (com `base: './'` para compatibilidade universal em subpastas do Pages)
- **Tailwind CSS v4** (tema dark moderno, responsivo e veloz)
- **Lucide React** (ícones automotivos e financeiros)
- **Canvas-Confetti** (efeitos de comemoração)
- **Newton-Raphson & Tabela Price** (cálculo financeiro preciso e testado)
