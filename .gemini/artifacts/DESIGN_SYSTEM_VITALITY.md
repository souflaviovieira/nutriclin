# 🎨 NutriClin Pro - PRECISION VITALITY Design System

> **Identidade Visual:** Vitalidade, Ciência, Calor Humano.
> **Status:** Implementado em 22/01/2026

---

## 1. Paleta de Cores: "Coral Vitality"

Fugimos do clichê "Azul/Verde de Saúde" para criar algo memorável e energético.

| Função | Cor | Hex | Referência Tailwind |
|--------|-----|-----|---------------------|
| **Primary** | **Coral/Terracotta** | `#E07B5E` | `bg-coral-400` |
| **Hover** | **Deep Coral** | `#D4694D` | `bg-coral-500` |
| **Surface** | **Warm Cream** | `#FDF6F0` | `bg-cream-100` |
| **Text Main** | **Slate Warm** | `#1E293B` | `text-slate-warm-800` |
| **Text Muted** | **Slate Soft** | `#94A3B8` | `text-slate-warm-400` |
| **Accent** | **Emerald/Amber** | Vários | `text-emerald-600` |

### Uso:
- **Botões Ação:** Gradiente Coral (`from-coral-400 to-coral-500`)
- **Backgrounds:** Creme suave (`bg-cream-100`) para reduzir fadiga visual
- **Bordas:** Sutis e quentes (`border-cream-200`)

---

## 2. Tipografia: "Editorial Science"

Combinação de precisão científica com elegância editorial.

### Display (Títulos e Números)
- **Fonte:** `Fraunces` (Google Fonts)
- **Estilo:** Serifada, personalidade forte, Soft-serif
- **Uso:** Headers H1-H3, Números de estatísticas (Big Numbers)

### Body (Texto e UI)
- **Fonte:** `DM Sans` (Google Fonts)
- **Estilo:** Geométrica, humanista, alta legibilidade
- **Uso:** Texto corrido, labels, botões

---

## 3. Geometria & UI: "Soft Precision"

- **Bordas:** Arredondadas amigáveis (`rounded-xl` a `rounded-2xl`)
- **Sombras:** Suaves e coloridas (`shadow-soft-lg` com tint de Coral)
- **Superfícies:** "Frosted Cream" (Vidro fosco quente) em vez de Glassmorphism padrão

---

## 4. Animações: "Spring Physics"

Todas as interações têm física de mola (não lineares) para parecerem orgânicas.

- **Load:** `animate-fade-in` e `animate-slide-up` (staggered)
- **Hover:** `scale-[1.02]` com transição suave
- **FAB:** Expandir com rotação e bounce

---

## 5. Componentes Chave

### Floating Action Button (FAB)
- Gradiente Coral vibrante
- Sombra colorida difusa (`shadow-glow`)
- Expansão "Speed Dial" para ações rápidas

### Stats Cards
- Layout responsivo (Horizontal Mobile / Vertical Desktop)
- Tipografia Display para números
- Ícones com fundo tonalizado

### Bottom Navigation (Mobile)
- Fundo Glassmorphism (efeito vidro)
- Ícones ativos com indicador "Glow"
- Animação de escala na seleção

---

## 🛠 Como extender

Para criar novos componentes, use as classes utilitárias do Tailwind configuradas em `index.html`:

```jsx
// Exemplo de Card
<div className="bg-white rounded-2xl p-6 shadow-soft-sm border border-cream-200 hover:border-coral-200 transition-all">
  <h3 className="font-display text-xl text-slate-warm-800">Título</h3>
  <p className="font-sans text-slate-warm-500">Conteúdo...</p>
  <button className="bg-coral-400 text-white rounded-xl px-4 py-2 mt-4 font-bold">
    Ação
  </button>
</div>
```
