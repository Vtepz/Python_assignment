--
-- PostgreSQL database dump
--

\restrict uhzBRelPXJS8XF4KughCOTh9JZAcYvW2JLvso9BgXXgZMqt2oHVKqIXM5cvwnXR

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-22 22:29:42

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- TOC entry 220 (class 1259 OID 16390)
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id integer NOT NULL,
    employee_id character varying(20) NOT NULL,
    full_name character varying(100) NOT NULL,
    "position" character varying(100) NOT NULL,
    department character varying(100) NOT NULL,
    salary numeric(10,2) NOT NULL,
    date_hired date NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_id_seq OWNER TO postgres;

--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 219
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- TOC entry 222 (class 1259 OID 16405)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    full_name character varying(100) NOT NULL,
    role character varying(30) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16404)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4861 (class 2604 OID 16393)
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- TOC entry 4862 (class 2604 OID 16408)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5017 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, employee_id, full_name, "position", department, salary, date_hired, created_at, updated_at) FROM stdin;
1	EMP001	Ava Johnson	HR Manager	Human Resources	72000.00	2021-05-10	2026-06-08 18:00:10.051886	2026-06-08 18:00:10.05189
2	EMP002	Liam Smith	Software Developer	IT	68000.00	2022-02-14	2026-06-08 18:00:10.054345	2026-06-08 18:00:10.054348
3	EMP003	Sophia Brown	Accountant	Finance	56000.00	2020-09-01	2026-06-08 18:00:10.055756	2026-06-08 18:00:10.055759
4	EMP004	Noah Davis	Recruitment Officer	Human Resources	52000.00	2023-03-20	2026-06-08 18:00:10.05682	2026-06-08 18:00:10.056823
5	EMP005	Mia Wilson	Operations Supervisor	Operations	61000.00	2021-11-08	2026-06-08 18:00:10.05764	2026-06-08 18:00:10.057642
6	EMP006	DANE	IT MANAGER	IT Department	12000.00	2024-01-17	2026-06-08 18:42:15.80921	2026-06-08 18:42:15.809216
9	EMP008	Phearom	Backend DEv	IT department	3000.00	2026-01-23	2026-06-09 12:19:53.233701	2026-06-09 12:19:53.233714
10	EMP009	Nang	HR	HR department	3000.00	2025-08-23	2026-06-09 12:22:11.241967	2026-06-09 12:22:11.241998
\.


--
-- TOC entry 5019 (class 0 OID 16405)
-- Dependencies: 222
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, full_name, role, password_hash, created_at) FROM stdin;
1	admin	System Administrator	Admin	scrypt:32768:8:1$4HFqCDAxwaS0YBGH$c5d27d689bf7d8b682990a56d82e47b939d9a60513a061a8bfc4998099aa586b264d7119f52763d90f9af9e53f57f6be90549753ad3f57de6b8b60fe8be2b9fb	2026-06-08 20:00:07.518726
\.


--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 219
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employees_id_seq', 11, true);


--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- TOC entry 4864 (class 2606 OID 16402)
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- TOC entry 4868 (class 2606 OID 16415)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4865 (class 1259 OID 16403)
-- Name: ix_employees_employee_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_employees_employee_id ON public.employees USING btree (employee_id);


--
-- TOC entry 4866 (class 1259 OID 16416)
-- Name: ix_users_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_username ON public.users USING btree (username);


-- Completed on 2026-06-22 22:29:42

--
-- PostgreSQL database dump complete
--

\unrestrict uhzBRelPXJS8XF4KughCOTh9JZAcYvW2JLvso9BgXXgZMqt2oHVKqIXM5cvwnXR

