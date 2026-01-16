import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    ArrowLeft, Save, Loader2, Search,
    Home as HomeIcon, MapPin, DollarSign,
    FileSearch, FileCheck, Eye, Gavel, Building2, Key,
    ArrowRight, Mail, ChevronDown, ChevronUp,
    ClipboardCheck, Scale, CheckCircle2,
    Monitor, Tablet, Smartphone, ZoomIn, ZoomOut,
    Menu, X, LayoutTemplate, Phone
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { PageBuilderProvider, usePageBuilder } from "@/components/admin/builder/PageBuilderContext";
import { EditableImage } from "@/components/admin/builder/EditableImage";
import { EditableText } from "@/components/admin/builder/EditableText";
import { TeamList } from "@/components/TeamList";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// --- HELPERS ---
const SectionHeader = ({ id, title, isActive, onToggle }: { id: string; title: string, isActive: boolean, onToggle: (id: string) => void }) => (
    <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-800 transition-colors rounded-lg mb-2 text-left"
    >
        <span className="text-gray-200 text-sm font-medium">{title}</span>
        {isActive ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
    </button>
);

const FieldInput = ({ label, contentKey, field, defaultValue, multiline = false }: { label: string; contentKey: string; field: string; defaultValue: string; multiline?: boolean }) => {
    const { contents, updateContent } = usePageBuilder();
    const value = contents[contentKey]?.[field] || defaultValue;

    return (
        <div className="space-y-1.5 mb-3">
            <Label className="text-gray-400 text-xs uppercase tracking-wider">{label}</Label>
            {multiline ? (
                <Textarea
                    value={value}
                    onChange={(e) => updateContent(contentKey, field, e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white min-h-[80px] focus:ring-accent-gold"
                />
            ) : (
                <Input
                    value={value}
                    onChange={(e) => updateContent(contentKey, field, e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white h-9 focus:ring-accent-gold"
                />
            )}
        </div>
    );
};

const FieldImage = ({ label, contentKey, field, defaultValue }: { label: string; contentKey: string; field: string; defaultValue: string }) => {
    const { contents, updateContent } = usePageBuilder();
    const value = contents[contentKey]?.[field] || defaultValue;

    return (
        <div className="space-y-1.5 mb-3">
            <Label className="text-gray-400 text-xs uppercase tracking-wider">{label}</Label>
            <div className="relative bg-gray-800 border border-dashed border-gray-600 rounded-lg overflow-hidden min-h-[100px] hover:border-accent-gold transition-colors group">
                <EditableImage
                    src={value}
                    onUpload={(url) => updateContent(contentKey, field, url)}
                    className="w-full h-auto object-contain max-h-[150px]"
                    bucket="site"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <p className="text-xs text-white font-medium">Clique para Trocar</p>
                </div>
            </div>
        </div>
    );
};

// --- HOME PREVIEW COMPONENT ---
const HomePreview = ({ contents, updateContent }: { contents: any, updateContent: any }) => {
    const getContent = (key: string, field: string, defaultVal: string = "") => contents[key]?.[field] || defaultVal;

    // FETCH REAL DATA
    const { data: leiloes } = useQuery({ queryKey: ["leiloes-home-preview"], queryFn: async () => { const { data } = await supabase.from("opportunities").select("*, opportunity_images(image_url)").eq("type", "LEILAO").order("created_at", { ascending: false }).limit(4); return data || []; } });
    const { data: imoveis } = useQuery({ queryKey: ["imoveis-home-preview"], queryFn: async () => { const { data } = await supabase.from("opportunities").select("*, opportunity_images(image_url)").eq("type", "IMOVEL").order("created_at", { ascending: false }).limit(4); return data || []; } });

    const processSteps = [
        { key: 'home_step_1', icon: <FileSearch className="w-8 h-8" />, defTitle: "Identificação de Imóvel", defDesc: "Encontramos os melhores imóveis..." },
        { key: 'home_step_2', icon: <FileCheck className="w-8 h-8" />, defTitle: "Análise do Edital", defDesc: "Avaliação completa da documentação..." },
        { key: 'home_step_3', icon: <Eye className="w-8 h-8" />, defTitle: "Visita Técnica", defDesc: "Inspeção presencial do imóvel..." },
        { key: 'home_step_4', icon: <Gavel className="w-8 h-8" />, defTitle: "Participação no Leilão", defDesc: "Representamos você durante todo o processo..." },
        { key: 'home_step_5', icon: <Building2 className="w-8 h-8" />, defTitle: "Assessoria Pós-Arrematação", defDesc: "Acompanhamento jurídico completo..." },
        { key: 'home_step_6', icon: <Key className="w-8 h-8" />, defTitle: "Entrega das Chaves", defDesc: "Garantimos a imissão na posse..." },
    ];

    return (
        <div className="bg-white font-sans text-gray-900 overflow-hidden">
            <div className="pointer-events-none origin-top-left"><Navbar /></div>

            {/* HERO */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0"><EditableImage src={getContent("home_hero", "image_url", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80")} onUpload={(url) => updateContent("home_hero", "image_url", url)} className="w-full h-full object-cover" bucket="site" /><div className="absolute inset-0 bg-gradient-to-r from-primary-navy/95 via-primary-navy/70 to-transparent" /></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-2xl">
                        <EditableText value={getContent("home_hero", "title", "Encontre um imóvel...")} onChange={(v) => updateContent("home_hero", "title", v)} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight bg-transparent border-none p-0 w-full" />
                        <EditableText value={getContent("home_hero", "subtitle", "Consultoria especializada...")} onChange={(v) => updateContent("home_hero", "subtitle", v)} className="text-xl text-gray-200 mb-10 bg-transparent border-none p-0 w-full" />
                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <Button className="bg-gradient-to-r from-accent-gold to-yellow-500 text-primary-navy font-bold px-8 py-3 rounded-xl min-w-[150px]"><EditableText value={getContent("home_hero", "button1_text", "Falar com Especialista")} onChange={(v) => updateContent("home_hero", "button1_text", v)} className="bg-transparent border-none p-0 text-center" /></Button>
                            <Button variant="ghost" className="bg-white/10 backdrop-blur-md border border-white/30 text-white"><EditableText value={getContent("home_hero", "button2_text", "Ver Oportunidades")} onChange={(v) => updateContent("home_hero", "button2_text", v)} className="bg-transparent border-none p-0 text-center" /></Button>
                        </div>
                        {/* Search Mock */}
                        <div className="bg-white rounded-xl p-6 shadow-2xl pointer-events-none opacity-100 transform-none"><div className="grid grid-cols-1 md:grid-cols-4 gap-4"><div className="space-y-2"><label className="text-sm font-medium text-gray-600 flex items-center gap-2"><HomeIcon className="w-4 h-4 text-accent-gold" /> Tipo</label><div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center text-gray-500 text-sm">Todos</div></div><div className="space-y-2"><label className="text-sm font-medium text-gray-600 flex items-center gap-2"><MapPin className="w-4 h-4 text-accent-gold" /> Local</label><div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center text-gray-500 text-sm">Todas</div></div><div className="space-y-2"><label className="text-sm font-medium text-gray-600 flex items-center gap-2"><DollarSign className="w-4 h-4 text-accent-gold" /> Valor</label><div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center text-gray-500 text-sm">Qualquer</div></div><div className="flex items-end"><Button className="w-full bg-accent-gold text-primary-navy font-bold py-6"><Search className="w-5 h-5 mr-2" /> Buscar</Button></div></div></div>
                    </div>
                </div>
            </section>

            {/* Steps & About & Grids omitted for brevity - logic remains same */}
            <section className="py-20 bg-white"><div className="container mx-auto px-6"><div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-bold text-primary-navy">Saiba como funciona</h2></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{processSteps.map((step, index) => (<div key={index} className="group bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-accent-gold"><div className="w-16 h-16 bg-accent-gold/10 rounded-xl flex items-center justify-center text-accent-gold mb-6">{step.icon}</div><EditableText value={getContent(step.key, "title", step.defTitle)} onChange={(v) => updateContent(step.key, "title", v)} className="text-xl font-bold text-primary-navy mb-4 bg-transparent border-none p-0 w-full" /><EditableText value={getContent(step.key, "text", step.defDesc)} onChange={(v) => updateContent(step.key, "text", v)} multiline className="text-gray-600 bg-transparent border-none p-0 w-full" /></div>))}</div></div></section>
            {/* About */}
            <section className="py-20 bg-gray-50"><div className="container mx-auto px-6"><div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"><EditableImage src={getContent("home_about", "image_url", "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80")} onUpload={(url) => updateContent("home_about", "image_url", url)} className="rounded-2xl shadow-2xl w-full h-auto" bucket="site" />
                <div>
                    <span className="text-accent-gold font-semibold uppercase tracking-wider text-sm">Sobre Nós</span>
                    <EditableText
                        value={getContent("home_about", "title", "São mais de 15 anos de experiência no mercado de leilões judiciais")}
                        onChange={v => updateContent("home_about", "title", v)}
                        className="text-3xl md:text-4xl font-bold text-primary-navy mt-2 mb-6 bg-transparent border-none p-0 w-full leading-tight"
                    />
                    <EditableText
                        value={getContent("home_about", "text", "O Grupo Alea Leilões conta com uma equipe multidisciplinar, formada por advogados especializados, corretores credenciados e analistas de mercado. Nossa missão é proporcionar segurança jurídica e as melhores oportunidades de investimento para nossos clientes.\n\nCom uma abordagem transparente e ética, já ajudamos centenas de investidores a encontrar imóveis com até 50% de desconto em relação ao valor de mercado, transformando leilões em oportunidades únicas de patrimônio.")}
                        onChange={v => updateContent("home_about", "text", v)}
                        multiline
                        className="text-gray-600 mb-6 bg-transparent border-none p-0 w-full whitespace-pre-line leading-relaxed"
                    />
                    <Button className="bg-accent-gold text-primary-navy font-bold px-8 py-6">
                        <EditableText value={getContent("home_about", "button_text", "Entre em Contato")} onChange={v => updateContent("home_about", "button_text", v)} className="bg-transparent border-none p-0" />
                    </Button>
                </div></div></div></section>
            <section className="py-20 bg-white"><div className="container mx-auto px-6"><h2 className="text-3xl font-bold text-primary-navy mb-8">Leilões</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{leiloes?.map((p: any) => <div key={p.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"><img src={p.opportunity_images?.[0]?.image_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80"} className="h-48 w-full object-cover" /><div className="p-4"><h3 className="font-bold text-primary-navy">{p.title}</h3><p className="text-green-600 font-bold">R$ {p.price?.toLocaleString()}</p></div></div>)}</div></div></section>
            <section className="py-20 bg-gray-50"><div className="container mx-auto px-6"><h2 className="text-3xl font-bold text-primary-navy mb-8">Imóveis</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{imoveis?.map((p: any) => <div key={p.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"><img src={p.opportunity_images?.[0]?.image_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80"} className="h-48 w-full object-cover" /><div className="p-4"><h3 className="font-bold text-primary-navy">{p.title}</h3><p className="text-green-600 font-bold">R$ {p.price?.toLocaleString()}</p></div></div>)}</div></div></section>

            {/* CTA */}
            <section className="relative py-24"><div className="absolute inset-0 z-0"><EditableImage src={getContent("home_cta", "image_url", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80")} onUpload={(url) => updateContent("home_cta", "image_url", url)} className="w-full h-full object-cover" bucket="site" /><div className="absolute inset-0 bg-primary-navy/90" /></div><div className="container mx-auto px-6 relative z-10 text-white"><EditableText value={getContent("home_cta", "title", "Pronto para investir?")} onChange={(v) => updateContent("home_cta", "title", v)} className="text-4xl font-bold mb-4 bg-transparent border-none w-full" /><EditableText value={getContent("home_cta", "text", "Entre em contato...")} onChange={(v) => updateContent("home_cta", "text", v)} multiline className="text-xl mb-8 bg-transparent border-none w-full" /><Button className="bg-accent-gold text-primary-navy font-bold py-4 px-8"><EditableText value={getContent("home_cta", "button_text", "Falar Conosco")} onChange={v => updateContent("home_cta", "button_text", v)} className="bg-transparent border-none p-0" /></Button></div></section>

            {/* FOOTER - Pass preview content */}
            <div className="pointer-events-none opacity-100 relative z-20"><Footer previewContent={contents} /></div>
        </div>
    )
}

// --- SERVICOS PREVIEW COMPONENT ---
const ServicosPreview = ({ contents, updateContent }: { contents: any, updateContent: (k: string, f: string, v: string) => void }) => {
    const getContent = (key: string, field: string, defaultVal: string = "") => contents[key]?.[field] || defaultVal;
    // Default data exactly matching Servicos.tsx
    const defaultServices = [
        {
            key: "service_1",
            icon: Gavel,
            title: "Leilões Judiciais",
            text: "Leilões determinados por decisões judiciais em processos de execução. Atuamos com total segurança jurídica e transparência.",
            features: ["Acompanhamento processual completo", "Análise jurídica detalhada", "Documentação regular", "Garantia de idoneidade"],
            image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80",
        },
        {
            key: "service_2",
            icon: Building2,
            title: "Leilões Extrajudiciais",
            text: "Processos de alienação fiduciária com total respaldo legal. Especialistas em execuções extrajudiciais de bens imóveis.",
            features: ["Processo ágil e transparente", "Cumprimento da legislação vigente", "Suporte técnico especializado", "Documentação completa"],
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80",
        },
        {
            key: "service_3",
            icon: ClipboardCheck,
            title: "Avaliação de Imóveis",
            text: "Laudos técnicos profissionais realizados por engenheiros e arquitetos credenciados. Avaliações precisas e fundamentadas.",
            features: ["Profissionais certificados", "Laudos técnicos detalhados", "Vistoria presencial", "Relatório fotográfico completo"],
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
        },
        {
            key: "service_4",
            icon: Scale,
            title: "Consultoria Jurídica",
            text: "Orientação legal especializada em direito imobiliário e processos de leilão. Equipe jurídica experiente ao seu dispor.",
            features: ["Análise jurídica completa", "Consultoria personalizada", "Suporte em todas as etapas", "Segurança nas transações"],
            image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80",
        }
    ];

    const getFeatures = (key: string, defaults: string[]) => {
        const val = contents[key]?.features;
        if (typeof val === 'string') return val.split('\n').filter((f: string) => f.trim());
        if (Array.isArray(val)) return val;
        return defaults;
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="pointer-events-none"><Navbar /></div>
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden mt-20"><div className="absolute inset-0"><EditableImage src={getContent("services_hero", "image_url", "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80")} onUpload={(url) => updateContent("services_hero", "image_url", url)} className="w-full h-full object-cover" bucket="site" /><div className="absolute inset-0 bg-black/50"></div></div><div className="relative z-10 text-center text-white p-4"><EditableText value={getContent("services_hero", "title", "Nossos Serviços")} onChange={(v) => updateContent("services_hero", "title", v)} className="text-5xl md:text-6xl font-serif font-bold mb-4 bg-transparent border-none text-center w-full" /><EditableText value={getContent("services_hero", "subtitle", "Soluções completas para suas necessidades")} onChange={(v) => updateContent("services_hero", "subtitle", v)} className="text-xl text-white/90 bg-transparent border-none text-center w-full" /></div></section>
            <section className="section-spacing bg-background"><div className="container-custom space-y-16">{defaultServices.map((s, i) => (<div key={s.key} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:grid-flow-dense" : ""}`}><div className={i % 2 === 1 ? "lg:col-start-2" : ""}><EditableText value={getContent(s.key, "title", s.title)} onChange={(v) => updateContent(s.key, "title", v)} className="text-3xl font-bold text-primary mb-4 bg-transparent border-none p-0 w-full" /><EditableText value={getContent(s.key, "text", s.text)} onChange={(v) => updateContent(s.key, "text", v)} multiline className="text-gray-600 mb-6 bg-transparent border-none p-0 w-full" />

                <ul className="space-y-3 mb-8">
                    {getFeatures(s.key, s.features).map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start space-x-3">
                            <CheckCircle2 className="text-accent-gold flex-shrink-0 mt-1" size={20} />
                            <span className="text-gray-700">{feature}</span>
                        </li>
                    ))}
                </ul>

                <div className="bg-gray-50 border border-gray-100 rounded-lg p-2 mb-4"><p className="text-xs text-gray-400 mb-1">Funcionalidades (Editar)</p><EditableText value={getContent(s.key, "features", s.features.join('\n'))} onChange={(v) => updateContent(s.key, "features", v)} multiline className="text-sm font-mono bg-transparent border-none p-0 w-full" /></div></div><div className={i % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}><div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100"><EditableImage src={getContent(s.key, "image_url", s.image)} onUpload={u => updateContent(s.key, "image_url", u)} className="w-full h-full object-cover" bucket="site" /></div></div></div>))}</div></section>
            <div className="pointer-events-none z-20 relative"><Footer previewContent={contents} /></div>
        </div>
    );
};

// --- CONTATO PREVIEW COMPONENT ---
const ContatoPreview = ({ contents, updateContent }: { contents: any, updateContent: any }) => {
    const getContent = (key: string, field: string, defaultVal: string = "") => contents[key]?.[field] || defaultVal;

    return (
        <div className="min-h-screen bg-white">
            <div className="pointer-events-none"><Navbar /></div>

            {/* Hero */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden mt-20">
                <div className="absolute inset-0 z-0">
                    <EditableImage src={getContent("contact_hero", "image_url", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80")} onUpload={u => updateContent("contact_hero", "image_url", u)} className="w-full h-full object-cover" bucket="site" />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
                <div className="relative z-10 text-center text-white p-4">
                    <EditableText value={getContent("contact_hero", "title", "Contato")} onChange={v => updateContent("contact_hero", "title", v)} className="text-5xl md:text-6xl font-serif font-bold mb-4 bg-transparent border-none text-center w-full" />
                    <EditableText value={getContent("contact_hero", "subtitle", "Estamos prontos para atendê-lo")} onChange={v => updateContent("contact_hero", "subtitle", v)} className="text-xl text-white/90 bg-transparent border-none text-center w-full" />
                </div>
            </section>

            <section className="section-spacing bg-background">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <EditableText value={getContent("contact_info", "title", "Fale Conosco")} onChange={v => updateContent("contact_info", "title", v)} className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6 bg-transparent border-none p-0 w-full" />
                            <EditableText value={getContent("contact_info", "text", "Entre em contato conosco através dos nossos canais de atendimento...")} onChange={v => updateContent("contact_info", "text", v)} multiline className="text-lg text-gray-500 mb-8 bg-transparent border-none p-0 w-full" />

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0"><Phone className="text-primary-navy" size={20} /></div>
                                    <div className="w-full">
                                        <h3 className="font-semibold text-primary mb-1">Telefone / WhatsApp</h3>
                                        <EditableText value={getContent("contact_info", "phone", "(11) 98765-4321")} onChange={v => updateContent("contact_info", "phone", v)} multiline className="text-gray-500 bg-transparent border-none p-0 w-full" />
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0"><Mail className="text-primary-navy" size={20} /></div>
                                    <div className="w-full">
                                        <h3 className="font-semibold text-primary mb-1">E-mail</h3>
                                        <EditableText value={getContent("contact_info", "email", "contato@grupoalea.com.br")} onChange={v => updateContent("contact_info", "email", v)} multiline className="text-gray-500 bg-transparent border-none p-0 w-full" />
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0"><MapPin className="text-primary-navy" size={20} /></div>
                                    <div className="w-full">
                                        <h3 className="font-semibold text-primary mb-1">Endereço</h3>
                                        <EditableText value={getContent("contact_info", "address", "Av. Paulista, 1000 - Bela Vista - SP")} onChange={v => updateContent("contact_info", "address", v)} multiline className="text-gray-500 bg-transparent border-none p-0 w-full" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-100">
                                <h3 className="font-serif font-semibold text-lg text-primary mb-4">Horário de Atendimento</h3>
                                <EditableText value={getContent("contact_info", "hours", "Segunda a Sexta: 9h às 18h\nSábado: 9h às 13h")} onChange={v => updateContent("contact_info", "hours", v)} multiline className="text-sm text-gray-500 bg-transparent border-none p-0 w-full" />
                            </div>
                        </div>

                        <div className="card-premium p-8 border border-gray-100 shadow-lg rounded-2xl">
                            <EditableText value={getContent("contact_form", "title", "Envie sua Mensagem")} onChange={v => updateContent("contact_form", "title", v)} className="text-2xl font-serif font-semibold text-primary mb-6 bg-transparent border-none p-0 w-full" />
                            <div className="space-y-4 opacity-50 pointer-events-none">
                                <Input placeholder="Nome" disabled />
                                <Input placeholder="Email" disabled />
                                <Textarea placeholder="Mensagem" disabled />
                                <Button className="w-full bg-accent-gold">Enviar</Button>
                            </div>
                            <p className="text-xs text-red-500 mt-4">* Formulário usa o mesmo Webhook da Home</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="pointer-events-none z-20 relative"><Footer previewContent={contents} /></div>
        </div>
    );
};

// --- CONTROLLER ---
const PageBuilderContent = () => {
    const navigate = useNavigate();
    const { contents, updateContent, saveAll, hasUnsavedChanges, loading } = usePageBuilder();
    const [isSaving, setIsSaving] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState<string | null>("hero");
    const [activePage, setActivePage] = useState<'home' | 'services' | 'contact'>('home');
    const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [zoom, setZoom] = useState(100);

    const handleSave = async () => { setIsSaving(true); try { await saveAll(); } finally { setIsSaving(false); } };
    const toggleSection = (section: string) => setActiveSection(activeSection === section ? null : section);

    if (loading) return <div className="h-screen flex items-center justify-center bg-gray-900 text-white"><Loader2 className="w-8 h-8 animate-spin mr-2" /> Carregando Editor...</div>;
    const previewWidth = previewMode === 'mobile' ? '375px' : previewMode === 'tablet' ? '768px' : '1440px';

    return (
        <div className="h-screen flex flex-col bg-gray-950 overflow-hidden">
            {/* Top Bar */}
            <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">{sidebarOpen ? <X size={20} /> : <Menu size={20} />}</Button>
                    <div className="h-6 w-px bg-gray-800 mx-2" />
                    <Button variant="ghost" className="text-gray-300 hover:text-white gap-2" onClick={() => navigate("/admin/dashboard")}><ArrowLeft size={16} /> Voltar</Button>
                    <span className="text-gray-500 text-sm">/</span>
                    <span className="text-white font-medium">Editor Visual</span>
                </div>
                <div className="flex items-center bg-gray-800 rounded-lg p-1 gap-1">
                    <button onClick={() => setPreviewMode('desktop')} className={`p-2 rounded-md transition-all ${previewMode === 'desktop' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`} title="Desktop"><Monitor size={16} /></button>
                    <button onClick={() => setPreviewMode('tablet')} className={`p-2 rounded-md transition-all ${previewMode === 'tablet' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`} title="Tablet"><Tablet size={16} /></button>
                    <button onClick={() => setPreviewMode('mobile')} className={`p-2 rounded-md transition-all ${previewMode === 'mobile' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`} title="Mobile"><Smartphone size={16} /></button>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 mr-4">
                        <ZoomOut size={14} className="text-gray-500" />
                        <Slider value={[zoom]} onValueChange={(v) => setZoom(v[0])} min={25} max={100} step={5} className="w-32" />
                        <span className="text-xs text-gray-400 w-8 text-right">{zoom}%</span>
                        <ZoomIn size={14} className="text-gray-500" />
                    </div>
                    <Button onClick={handleSave} disabled={!hasUnsavedChanges || isSaving} className={`${hasUnsavedChanges ? 'bg-accent-gold hover:bg-yellow-500 text-primary-navy' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        {isSaving ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar */}
                <div className={`${sidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full opacity-0'} transition-all duration-300 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0 overflow-hidden relative z-40`}>
                    <div className="p-4 border-b border-gray-800">
                        <div className="grid grid-cols-3 gap-2 bg-gray-800 p-1 rounded-lg">
                            <button onClick={() => setActivePage('home')} className={`py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-colors ${activePage === 'home' ? 'bg-primary-navy text-white shadow' : 'text-gray-400 hover:text-white'}`}>Home</button>
                            <button onClick={() => setActivePage('services')} className={`py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-colors ${activePage === 'services' ? 'bg-primary-navy text-white shadow' : 'text-gray-400 hover:text-white'}`}>Serviços</button>
                            <button onClick={() => setActivePage('contact')} className={`py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-colors ${activePage === 'contact' ? 'bg-primary-navy text-white shadow' : 'text-gray-400 hover:text-white'}`}>Contato</button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-20 scrollbar-thin scrollbar-thumb-gray-700">
                        {activePage === 'home' ? (
                            <>
                                <SectionHeader id="hero" title="Hero / Topo" isActive={activeSection === "hero"} onToggle={toggleSection} />
                                {activeSection === "hero" && <div className="pl-2 pr-2 pb-4 border-l-2 border-gray-800 ml-2 space-y-4">
                                    <FieldInput label="Título" contentKey="home_hero" field="title" defaultValue="" />
                                    <FieldInput label="Subtítulo" contentKey="home_hero" field="subtitle" defaultValue="" />
                                    <FieldImage label="Fundo" contentKey="home_hero" field="image_url" defaultValue="" />
                                    <FieldInput label="Botão 1" contentKey="home_hero" field="button1_text" defaultValue="" />
                                    <FieldInput label="Botão 2" contentKey="home_hero" field="button2_text" defaultValue="" />
                                </div>}
                                <SectionHeader id="steps" title="Passos (Processo)" isActive={activeSection === "steps"} onToggle={toggleSection} />
                                {activeSection === "steps" && <div className="pl-2 pr-2 pb-4 border-l-2 border-gray-800 ml-2 space-y-4">{[1, 2, 3, 4, 5, 6].map(i => <div key={i}><p className="text-accent-gold text-xs font-bold mb-2 mt-2">PASSO {i}</p><FieldInput label="Titulo" contentKey={`home_step_${i}`} field="title" defaultValue="" /><FieldInput label="Texto" contentKey={`home_step_${i}`} field="text" defaultValue="" multiline /></div>)}</div>}
                                <SectionHeader id="about" title="Sobre Nós" isActive={activeSection === "about"} onToggle={toggleSection} />
                                {activeSection === "about" && <div className="pl-2 pr-2 pb-4 border-l-2 border-gray-800 ml-2 space-y-4"><FieldInput label="Título" contentKey="home_about" field="title" defaultValue="" /><FieldInput label="Texto" contentKey="home_about" field="text" defaultValue="" multiline /><FieldImage label="Imagem" contentKey="home_about" field="image_url" defaultValue="" /></div>}
                                <SectionHeader id="cta" title="CTA Home" isActive={activeSection === "cta"} onToggle={toggleSection} />
                                {activeSection === "cta" && <div className="pl-2 pr-2 pb-4 border-l-2 border-gray-800 ml-2 space-y-4">
                                    <FieldInput label="Título" contentKey="home_cta" field="title" defaultValue="" />
                                    <FieldInput label="Texto" contentKey="home_cta" field="text" defaultValue="" multiline />
                                    <FieldInput label="Botão (Texto)" contentKey="home_cta" field="button_text" defaultValue="Falar Conosco" />
                                    <FieldInput label="Webhook URL (N8N/Make)" contentKey="home_cta" field="webhook_url" defaultValue="" />
                                    <FieldImage label="Fundo" contentKey="home_cta" field="image_url" defaultValue="" />
                                </div>}
                                <SectionHeader id="footer" title="Rodapé Completo" isActive={activeSection === "footer"} onToggle={toggleSection} />
                                {activeSection === "footer" && <div className="pl-2 pr-2 pb-4 border-l-2 border-gray-800 ml-2 space-y-4">
                                    <p className="text-xs text-gray-500 mb-2">Configure o rodapé visível em todas as páginas.</p>
                                    <div className="bg-gray-800 p-2 rounded mb-2"><p className="text-accent-gold text-xs font-bold mb-1">SOBRE</p><FieldInput label="Título" contentKey="footer_about" field="title" defaultValue="Grupo Alea" /><FieldInput label="Subtítulo" contentKey="footer_about" field="subtitle" defaultValue="Leilões" /><FieldInput label="Texto" contentKey="footer_about" field="text" defaultValue="..." multiline /></div>
                                    <div className="bg-gray-800 p-2 rounded mb-2"><p className="text-accent-gold text-xs font-bold mb-1">CONTATO</p><FieldInput label="Telefone" contentKey="footer_contact" field="text" defaultValue="(11) ..." /><FieldInput label="Email" contentKey="footer_contact" field="subtitle" defaultValue="contato@..." /><FieldInput label="Endereço" contentKey="footer_contact" field="title" defaultValue="São Paulo - SP" /></div>
                                    <div className="bg-gray-800 p-2 rounded"><p className="text-accent-gold text-xs font-bold mb-1">REDES SOCIAIS (Links)</p><FieldInput label="Facebook" contentKey="footer_social" field="text" defaultValue="#" /><FieldInput label="Instagram" contentKey="footer_social" field="subtitle" defaultValue="#" /><FieldInput label="LinkedIn" contentKey="footer_social" field="title" defaultValue="#" /></div>
                                </div>}
                            </>
                        ) : activePage === 'services' ? (
                            <>
                                <SectionHeader id="s_hero" title="Hero Serviços" isActive={activeSection === "s_hero"} onToggle={toggleSection} />
                                {activeSection === "s_hero" && <div className="pl-2 pr-2 pb-4 border-l-2 border-gray-800 ml-2 space-y-4"><FieldInput label="Título" contentKey="services_hero" field="title" defaultValue="" /><FieldInput label="Subtítulo" contentKey="services_hero" field="subtitle" defaultValue="" /><FieldImage label="Fundo" contentKey="services_hero" field="image_url" defaultValue="" /></div>}
                                {[1, 2, 3, 4].map(i => (<div key={i}><SectionHeader id={`s_${i}`} title={`Serviço ${i}`} isActive={activeSection === `s_${i}`} onToggle={toggleSection} />{activeSection === `s_${i}` && <div className="pl-2 pr-2 pb-4 border-l-2 border-gray-800 ml-2 space-y-4"><FieldInput label="Título" contentKey={`service_${i}`} field="title" defaultValue="" /><FieldInput label="Descrição" contentKey={`service_${i}`} field="text" defaultValue="" multiline /><FieldInput label="Features" contentKey={`service_${i}`} field="features" defaultValue="" multiline /><FieldImage label="Imagem" contentKey={`service_${i}`} field="image_url" defaultValue="" /></div>}</div>))}
                                <SectionHeader id="s_cta" title="CTA Serviços" isActive={activeSection === "s_cta"} onToggle={toggleSection} />
                                {activeSection === "s_cta" && <div className="pl-2 pr-2 pb-4 border-l-2 border-gray-800 ml-2 space-y-4"><FieldInput label="Título" contentKey="services_cta" field="title" defaultValue="" /><FieldInput label="Texto" contentKey="services_cta" field="text" defaultValue="" multiline /></div>}
                            </>
                        ) : (
                            <>
                                <SectionHeader id="c_hero" title="Topo Contato" isActive={activeSection === "c_hero"} onToggle={toggleSection} />
                                {activeSection === "c_hero" && <div className="pl-2 pr-2 pb-4 border-l-2 border-gray-800 ml-2 space-y-4"><FieldInput label="Título" contentKey="contact_hero" field="title" defaultValue="" /><FieldInput label="Subtítulo" contentKey="contact_hero" field="subtitle" defaultValue="" /><FieldImage label="Fundo" contentKey="contact_hero" field="image_url" defaultValue="" /></div>}
                                <SectionHeader id="c_info" title="Informações" isActive={activeSection === "c_info"} onToggle={toggleSection} />
                                {activeSection === "c_info" && <div className="pl-2 pr-2 pb-4 border-l-2 border-gray-800 ml-2 space-y-4">
                                    <FieldInput label="Título Principal" contentKey="contact_info" field="title" defaultValue="" />
                                    <FieldInput label="Texto Intro" contentKey="contact_info" field="text" defaultValue="" multiline />
                                    <p className="text-xs text-gray-500 mt-2 font-bold">INFO DE CONTATO</p>
                                    <FieldInput label="Telefone" contentKey="contact_info" field="phone" defaultValue="" multiline />
                                    <FieldInput label="Email" contentKey="contact_info" field="email" defaultValue="" multiline />
                                    <FieldInput label="Endereço" contentKey="contact_info" field="address" defaultValue="" multiline />
                                    <FieldInput label="Horários" contentKey="contact_info" field="hours" defaultValue="" multiline />
                                </div>}
                                <SectionHeader id="c_form" title="Formulário / Webhook" isActive={activeSection === "c_form"} onToggle={toggleSection} />
                                {activeSection === "c_form" && <div className="pl-2 pr-2 pb-4 border-l-2 border-gray-800 ml-2 space-y-4">
                                    <FieldInput label="Título do Form" contentKey="contact_form" field="title" defaultValue="" />
                                    <p className="text-xs text-yellow-500 mb-2">Este formulário compartilha a mesma URL de Webhook da Home Page.</p>
                                    <FieldInput label="Webhook URL (N8N/Make)" contentKey="home_cta" field="webhook_url" defaultValue="" />
                                </div>}
                            </>
                        )}
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 bg-gray-950 overflow-auto flex items-start justify-center p-8 relative scrollbar-hide">
                    <div
                        className="bg-white shadow-2xl transition-all duration-300 origin-top overflow-hidden ring-1 ring-gray-800"
                        style={{
                            width: previewWidth,
                            minHeight: '100vh', // Ensure height is enough
                            transform: `scale(${zoom / 100})`,
                            marginBottom: `${(100 - zoom) * 10}vh`,
                            height: 'auto'
                        }}
                    >
                        {activePage === 'home' ? <HomePreview contents={contents} updateContent={updateContent} /> : activePage === 'services' ? <ServicosPreview contents={contents} updateContent={updateContent} /> : <ContatoPreview contents={contents} updateContent={updateContent} />}
                    </div>
                </div>
            </div>

        </div>

    );
};

const PageBuilder = () => (
    <PageBuilderProvider>
        <PageBuilderContent />
    </PageBuilderProvider>
);

export default PageBuilder;
