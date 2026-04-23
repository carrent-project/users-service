--
-- PostgreSQL database dump
--

\restrict DhsekIeRjD0hPBRMgfFhNfkZboqG30mE2baWj8975qSRdrdtFbwSlEBTYdu5Rjv

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 15.17 (Debian 15.17-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: relations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.relations (
    "userId" text NOT NULL,
    "roleId" integer NOT NULL
);


ALTER TABLE public.relations OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    phone text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
91bdf158-bb6b-4f92-a06a-ad33816d907b	92eda9dd4e467e7211d6a127be23e63a2fa8849bf8e027cf73d2b38c5f2cfef9	2026-03-10 17:11:20.239583+00	20260310171120_init	\N	\N	2026-03-10 17:11:20.225736+00	1
ec8f0b40-c36e-4d50-8f67-5de06e50cbf1	bfbea618a03d4fe824e42b8ab8a11e9a11a122e119f39d63341212138603374b	2026-03-26 15:18:29.542403+00	20260326151829_add_roles	\N	\N	2026-03-26 15:18:29.513274+00	1
1f32ddb6-7489-4166-bc88-6783a7009c7d	bd51f6ef84eaf9ea243c32398a1e79de3e35a624e91dffe32d49a708c49d426e	2026-03-26 15:25:25.567528+00	20260326152525_add_role_description	\N	\N	2026-03-26 15:25:25.563874+00	1
b9f80d70-f19e-4972-83a4-2920b242a230	5e4134a78d6338956106d9195fdae1f14991b211e246da38095cd16fc48a91c0	2026-03-26 15:26:29.519694+00	20260326152629_make_role_description_required	\N	\N	2026-03-26 15:26:29.517423+00	1
9ce3fe57-0f63-409b-a945-d64b27d57730	14d94d79d9e94d55bcd435f9fd6806a0b70ffa1a726ae6dcffbb90cb96784156	2026-03-26 16:31:19.77846+00	20260326163119_add_roles	\N	\N	2026-03-26 16:31:19.771922+00	1
2e842884-d8a7-4540-8f92-9b4f7be99768	573bbccf83a98b63dcb15f1e23d6ad65c79e0a53093bf9965531178890051f87	2026-04-01 13:46:33.796698+00	20260401134633_add_phone_field	\N	\N	2026-04-01 13:46:33.778186+00	1
ffce6e67-f86a-42af-824a-91ca27e436f7	cecba1e34cdd3865c1fc088bee18dbb5b72db1b81ef75b0843ce968a61467df7	2026-04-01 15:43:46.439482+00	20260401154346_phone_requiered	\N	\N	2026-04-01 15:43:46.432834+00	1
\.


--
-- Data for Name: relations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.relations ("userId", "roleId") FROM stdin;
c85d941b-c041-4255-939a-0b61d3391594	3
6d275fe5-3221-4407-b12b-8d8ad23a502d	3
880af002-600d-4000-9f06-80bbcc8e0c7d	3
0a99e65d-21b8-425a-9e16-361527c36ad4	1
0a99e65d-21b8-425a-9e16-361527c36ad4	3
0a99e65d-21b8-425a-9e16-361527c36ad4	2
b1b37842-3703-4e15-af1c-8532ce32abe1	1
b1b37842-3703-4e15-af1c-8532ce32abe1	3
b1b37842-3703-4e15-af1c-8532ce32abe1	2
e7224d05-53ec-43b7-b7b1-39c9a0842aed	3
823b14e1-d991-4521-867c-40fb7cb63ebf	1
823b14e1-d991-4521-867c-40fb7cb63ebf	3
823b14e1-d991-4521-867c-40fb7cb63ebf	2
27365189-bdc6-4306-a481-587a7bbee64b	1
27365189-bdc6-4306-a481-587a7bbee64b	3
27365189-bdc6-4306-a481-587a7bbee64b	2
0ae9e919-e8d3-4d9d-bf42-12e14545aec9	3
090e3510-1323-4658-8760-26ea1fc0f093	3
0429ad2f-bc6e-4ed9-9126-009c034f811c	3
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description) FROM stdin;
1	admin	Администратор
3	user	Пользователь
2	manager	Менеджер
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, name, "createdAt", "updatedAt", phone) FROM stdin;
0a99e65d-21b8-425a-9e16-361527c36ad4	kaban@dimas.ru	$2b$10$ju2WqyXaPAw9AzhJq9uLAOkh33sp54zwGgUXbQIfpbJJqsEYPgML6	Kaban D.A.	2026-03-12 12:40:50.307	2026-03-31 13:58:39.165	79696400856
090e3510-1323-4658-8760-26ea1fc0f093	user60@example.com	$2b$10$PTlvgh5OohhxE1zaRSHw.OJ8FEe4j.Z4rfzoFI.H.jAvY4Fo2qfBq	User 60	2026-03-25 16:25:40.623	2026-03-25 16:25:40.623	79696400333
0ae9e919-e8d3-4d9d-bf42-12e14545aec9	user26@example.com	$2b$10$Jz/uqVlevyf47MjKhOIX4OK5Sh6J.Qan5GL2U0AstB9S40/oAYATK	User 26	2026-03-25 16:25:40.623	2026-03-25 16:25:40.623	79696408735
b1b37842-3703-4e15-af1c-8532ce32abe1	OOO_Tion@mail.ru	$2b$10$ie8oNOZVPjQHNfwr3W1h8u4IRCgi6c3oczBKpdD2GhvrsMSCS8dYi	Kabanov Alexey	2026-04-01 16:19:39.917	2026-04-01 16:53:02.52	79109722142
e7224d05-53ec-43b7-b7b1-39c9a0842aed	inna@mail.ru	$2b$10$R3b8Sr/qZcoe6VssB9OSMeBujez3bHHomHy/MeToB7uO8UEifxG42	inna	2026-04-02 16:31:31.883	2026-04-02 16:31:31.883	79999999921
823b14e1-d991-4521-867c-40fb7cb63ebf	testov@email.ru	$2b$10$bxynTOB6yfZd8tUF8nZ6quz/hCIHGX./Q/5lk4A/htaYvSzW.7cUa	updated user	2026-04-08 04:34:28.962	2026-04-08 08:00:11.319	79999999777
0429ad2f-bc6e-4ed9-9126-009c034f811c	user68@example.com	$2b$10$8RoYyfEFsALlN1ibV0CZsuguCExGj8Si82PCPQMjj4Q/1T9lwBx/2	User 68	2026-03-25 16:25:40.623	2026-03-25 16:25:40.623	79696400822
27365189-bdc6-4306-a481-587a7bbee64b	super@puper.ru	$2b$10$2NqiRHY8RUi8VnllXkaZ7.P2TgfBmt000raC2nvqoRHvCQcuK0qWG	user name	2026-04-10 08:16:53.649	2026-04-10 08:16:53.649	79999999999
880af002-600d-4000-9f06-80bbcc8e0c7d	testov1@test.ru	$2b$10$djxZ6cOzzfIpg655uDBQhe.IhBl6r6tT1Szx7hvTJpAwPcNYdz2ri	teeest	2026-03-19 18:11:31.685	2026-03-19 18:38:27.941	79109755489
6d275fe5-3221-4407-b12b-8d8ad23a502d	testov@test.ru	$2b$10$qX//GBJqgSaLxd1d6p7LM.dvihTQ5ZB.aa/pf6C.4TjPV8qkRGG2C	teeest777	2026-03-19 18:10:58.255	2026-04-08 07:57:46.229	79896465777
c85d941b-c041-4255-939a-0b61d3391594	kabanooovd@yandex.ru	$2b$10$616giucuMnhHY6c6Xl0E0OVkGjeFI2QXoDvHgUKXb6BHkdRNPEwIG	Kabanooovd	2026-03-19 18:05:05.108	2026-04-01 16:52:55.68	79696400855
\.


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 6, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: relations relations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relations
    ADD CONSTRAINT relations_pkey PRIMARY KEY ("userId", "roleId");


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: roles_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_phone_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_phone_key ON public.users USING btree (phone);


--
-- Name: relations relations_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relations
    ADD CONSTRAINT "relations_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: relations relations_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relations
    ADD CONSTRAINT "relations_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict DhsekIeRjD0hPBRMgfFhNfkZboqG30mE2baWj8975qSRdrdtFbwSlEBTYdu5Rjv

