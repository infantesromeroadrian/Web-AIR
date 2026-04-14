# CAPITULO 0 — GENESIS

---

```
BIOMETRICS [FLASHBACK MODE]
HR:  72 BPM (baseline)
HRV: 58ms (young, unoptimized, pre-protocol)
GLU: 104 mg/dL (post-cafeteria, institutional food)
LOC: 40.3312N, -3.7658W
ALT: 667m
TMP: 11C / 38% humidity
DATE: 2019-11-14 — 22:47 UTC
```

---

## I

Madrid huele a asfalto mojado y a castanas asadas en noviembre. El campus de Leganes de la UC3M se vaciaba a las diez. A las once no quedaba nadie. A las once y cuarenta y siete, Adrian Infantes Romero estaba solo en el laboratorio 3.07 del edificio Sabatini, con la unica compania de los ventiladores de un rack que nadie habia apagado desde septiembre.

Tenia veintiun anos. Un portatil Lenovo ThinkPad T480 con la bisagra rota y un sticker de Python que se despegaba por las esquinas. Unos AirPods de segunda generacion que le habia regalado su madre por aprobar todo en junio. Un cafe de maquina que llevaba frio cuarenta minutos.

Y un problema.

El proyecto de fin de carrera de Marcos Delgado Santana — companero, colega de practicas, rival silencioso — habia ganado el premio de innovacion del departamento. Un sistema de deteccion de fraude bancario usando random forests. Marcos lo habia presentado como original. El tribunal lo habia aplaudido. El decano le habia dado la mano. La noticia estaba en la web de la universidad con foto incluida.

Adrian sabia que no era original. Sabia exactamente de donde venia.

Porque el se lo habia explicado.

---

Tres meses antes, en la cafeteria del edificio, Adrian le habia dibujado la arquitectura en una servilleta. Feature engineering sobre transacciones temporales. Ventanas deslizantes de 7, 14 y 30 dias. Un ensemble de tres modelos votando por mayoria. Marcos habia dicho "interesante" y habia cambiado de tema.

Adrian no habia pensado mas en ello. No tenia tiempo. Trabajaba dieciseis horas al dia entre clases, el TFG real, y las practicas en una consultora de datos que le pagaba seiscientos euros al mes por hacer dashboards en Power BI que luego firmaba un senior.

Cuando vio la presentacion de Marcos — las mismas ventanas deslizantes, el mismo ensemble, hasta el mismo nombre para la funcion de preprocesamiento, `clean_temporal_features()` — no sintio rabia.

Sintio curiosidad.

---

Curiosidad por un problema concreto: si el sistema de Marcos se habia desplegado como demo en un servidor de la universidad para la evaluacion, y si ese servidor era el mismo nodo de practicas al que todos los alumnos tenian acceso SSH con credenciales por defecto...

Entonces el modelo de Marcos no era solo plagio intelectual.

Era un sistema vulnerable.

Adrian cerro el navegador. Abrio la terminal.

```
ssh alumno@lab-server.inf.uc3m.es
pr4ct1c4s2019
```

Entro al primer intento.

---

## II

No fue un hack. Fue una auditoria no autorizada que duro cuarenta y tres minutos.

El servidor corria Ubuntu 18.04 sin actualizar desde marzo. El modelo de Marcos estaba en `/home/mdelgado/tfg/`, con permisos 755 — legible por cualquiera. El script de entrenamiento guardaba las credenciales de la base de datos en texto plano dentro de un archivo llamado, con la creatividad caracteristica de un alumno de cuarto, `config_data.py`.

Adrian no toco nada.

Leyo.

Leyo el codigo fuente y confirmo lo que sospechaba: el setenta por ciento de la logica era identica a lo que el le habia explicado en la cafeteria. Las variables tenian nombres diferentes. Los comentarios eran nuevos. Pero la arquitectura era un calco.

Leyo el `config_data.py` y encontro las credenciales de una base de datos PostgreSQL con 43,000 transacciones sinteticas — generadas, curiosamente, con un script que Marcos habia copiado de un repositorio de Kaggle sin atribucion.

Leyo los logs del servidor y descubrio que Marcos habia dejado un cronjob corriendo que reentrenaba el modelo cada domingo a las 03:00 — consumiendo recursos de un servidor compartido por ochenta alumnos sin que nadie lo hubiera notado.

Y leyo algo mas.

En `/home/mdelgado/tfg/.git/`, la historia completa del repositorio. Commits con fecha. Mensajes. Y un commit del 12 de agosto — tres semanas despues de la conversacion en la cafeteria — titulado:

```
git log --oneline
a3f7c21 add temporal window features (Adrian's idea, adapted)
```

Adrian se quedo mirando la pantalla. El cursor parpadeaba. Los ventiladores del rack zumbaban como insectos atrapados en cristal.

Marcos lo habia admitido. En un commit que nadie leeria. En un mensaje que solo existia en un servidor que nadie auditaba. La confesion perfecta: escrita, fechada, almacenada, y completamente invisible.

A menos que alguien la encontrara.

---

## III

*Lo que hice despues fue la primera decision real de mi vida.*

*No fue hackear el servidor. Eso fue facil. Trivial. Credenciales por defecto, permisos abiertos, codigo sin proteger. Cualquier alumno de segundo con un tutorial de YouTube podria haberlo hecho.*

*La decision fue que hacer con lo que encontre.*

*Tenia tres opciones. Las vi con una claridad que me asusto.*

*Opcion uno: denunciarlo. Ir al tribunal del TFG con el commit, el log, la servilleta que probablemente seguia en alguna papelera de la cafeteria. Justicia academica. La opcion que cualquier persona razonable elegiria.*

*Opcion dos: no hacer nada. Tragar. Felicitar a Marcos. Terminar mi propio TFG sobre otra cosa. Seguir adelante. La opcion que cualquier persona sensata elegiria.*

*Opcion tres.*

*La tercera opcion no tenia nombre todavia. Pero ya existia en algun pliegue de mi cortex prefrontal, esperando a que yo la articulara.*

---

Adrian no durmio esa noche. Camino por el Madrid vacio a las tres de la manana — desde Leganes hasta Embajadores por la carretera de Toledo, con el portatil en la mochila y los AirPods puestos sin musica, escuchando solo el rumor de los camiones de reparto y el ladrido distante de algun perro detras de una valla industrial.

A las cuatro y doce minutos, sentado en un banco del Parque del Casino de la Reina con las zapatillas mojadas del rocio, abrio el portatil y empezo a escribir.

No un email. No una denuncia. No un mensaje para Marcos.

Un script.

---

## IV

Lo llamo `silent_audit.py`. Cuarenta y siete lineas.

El script no modificaba nada. No borraba nada. No inyectaba nada. Lo unico que hacia era generar un reporte. Un documento PDF, limpio y profesional, que detallaba cada vulnerabilidad del servidor del laboratorio, cada permiso mal configurado, cada credencial expuesta, cada cronjob no autorizado. Sin mencionar a Marcos por nombre. Sin mencionar el plagio.

Solo los hechos tecnicos.

Lo envio desde un correo temporal — `audit.infosec.uc3m@protonmail.com` — al CISO de la universidad, al jefe del departamento de informatica, y al coordinador de practicas. Con una nota de una linea:

```
Auditoria de seguridad no solicitada del nodo lab-server.inf.uc3m.es.
Se recomienda revision inmediata.
— Un alumno preocupado.
```

Cuarenta y ocho horas despues, el servidor estaba offline. Setenta y dos horas despues, el departamento abrio una investigacion interna. Cinco dias despues, Marcos Delgado Santana fue convocado a una reunion donde le preguntaron por que tenia credenciales de base de datos en texto plano en un directorio publico, por que consumia recursos compartidos con cronjobs no autorizados, y por que habia un commit en su repositorio que referenciaba a otro alumno como fuente de la idea central del proyecto.

Le retiraron el premio. No le expulsaron — la universidad no queria publicidad. Le dieron un aprobado raspado y un asterisco en el acta que solo veria la comision de titulaciones.

Adrian no fue mencionado. No fue citado. No fue felicitado. No fue nada.

*Y eso fue exactamente lo que quise.*

---

## V

*Lo importante no fue la justicia. Si hubiera querido justicia, habria ido al tribunal. Habria puesto mi nombre. Habria reclamado la autoria. Habria ganado, probablemente.*

*Lo importante fue el descubrimiento.*

*Descubri que podia actuar sin ser visto. Que podia modificar un resultado sin que nadie supiera que yo habia intervenido. Que el anonimato no era una limitacion — era una ventaja operativa.*

*Descubri que un reporte bien escrito, enviado desde el angulo correcto, podia desencadenar una reaccion en cadena que produjera exactamente el efecto deseado sin dejar rastro causal hasta mi.*

*Descubri que me gustaba.*

*No la venganza — eso es para amateurs. Lo que me gustaba era el mecanismo. La precision. La elegancia de un sistema que se ejecuta solo y produce el resultado exacto que disenaste.*

*Esa noche, en mi habitacion del piso compartido de Leganes, con el portatil sobre las rodillas y el ruido del trafico de la M-40 filtrando por la ventana, cree una cuenta.*

*No use mi nombre. No use mi cara. No use mi IP.*

*Use una frecuencia.*

---

```
Registro de actividad — Red TOR
Timestamp: 2019-11-19T03:22:14Z
Nueva cuenta creada en foro privado [REDACTED]
Username: L4tentNoise
PGP Key: 4096-bit RSA, generada offline
Primer mensaje: "Testing."

Firma:
  "El ruido latente es la senal que nadie esta midiendo."
```

---

## VI

Los siguientes catorce meses fueron un segundo grado universitario que no daba certificado.

De dia, Adrian Infantes terminaba su carrera. Iba a clase. Hacia examenes. Entregaba practicas. Sonreia en las fotos de grupo. Cenaba con sus padres los domingos en Carabanchel y les decia que todo iba bien, que el ultimo semestre era duro pero controlable, que las practicas en la consultora le estaban ensenando mucho, que estaba comiendo bien.

Su madre le creia. Su padre le preguntaba menos. Su hermana, Clara, de diecisiete anos, le mandaba memes y le pedia ayuda con los deberes de matematicas por WhatsApp a las once de la noche.

Adrian les contestaba siempre. Sin excepcion. Sin retraso. Porque Adrian Infantes era un buen hijo, un buen hermano, un buen estudiante, un buen empleado.

L4tentNoise era otra cosa.

---

De noche, L4tentNoise leia. Papers de adversarial machine learning. Articulos de seguridad ofensiva. Documentacion de herramientas que no aparecian en ningun syllabus universitario. Whitepapers de Anthropic sobre alignment. Posts de investigadores de OpenAI sobre red teaming. El framework MITRE ATLAS completo, memorizado como quien memoriza las reglas de un juego que planea ganar.

L4tentNoise no hacia CTFs por puntos. Hacia auditorias reales, no solicitadas, de sistemas que encontraba expuestos. Siempre anonimo. Siempre documentado. Siempre enviando el reporte al responsable antes de que el problema se convirtiera en noticia.

Nunca pidio credito. Nunca pidio dinero. Nunca pidio nada.

*Todavia no.*

*En aquellos meses aprendi tres cosas que ningun curso ensena:*

*Primera: la diferencia entre un hacker y un ingeniero de seguridad es la misma que entre un cerrajero y un ladron. Las herramientas son identicas. La intencion las separa. Y la intencion es invisible.*

*Segunda: los sistemas mas vulnerables no son los que tienen bugs en el codigo. Son los que asumen que nadie esta mirando. La confianza implicita es el vector de ataque mas poderoso que existe.*

*Tercera: la identidad es un protocolo. Puedes correr varios en el mismo hardware. Solo necesitas que los contextos nunca se filtren entre si.*

---

## VII

Junio de 2021. Linea 3 de metro, estacion Leganes Central, direccion Moncloa. Hora punta de la manana.

Adrian llevaba un traje barato de Zara que le apretaba en los hombros, el ThinkPad T480 con la bisagra sujeta con cinta americana en la mochila, y una carpeta con su curriculum impreso en papel de 100 gramos. Iba de pie, agarrado a la barra, entre gente que leia el movil y gente que dormia.

El curriculum decia la verdad: Grado en Ingenieria Informatica, especialidad en Ciencia de Datos. Practicas en consultoria. TFG sobre optimizacion de pipelines ETL (nota: 8.7). Nivel avanzado de Python, SQL, Docker, scikit-learn. Ingles: C1 Cambridge.

El curriculum no decia lo que L4tentNoise habia hecho en catorce meses: diecisiete auditorias no solicitadas, cuatro vulnerabilidades criticas reportadas de forma anonima, dos papers leidos por semana, un conocimiento enciclopedico de los vectores de ataque contra sistemas de machine learning que ningun otro candidato de veintiun anos en Espana tenia.

El curriculum no necesitaba decirlo.

L4tentNoise no existia en papel.

*Y asi debia ser.*

---

```
BIOMETRICS [TRANSITION]
HR:  68 BPM (calma pre-operativa)
HRV: 62ms (mejorando — primeros protocolos de optimizacion)
GLU: 89 mg/dL (ayuno 14h — primer experimento con IF)
LOC: 40.3856N, -3.7263W (Metro Leganes Central)
OUTFIT: Traje Zara slim fit marino, camisa blanca,
        Nike Pegasus 37 (pre-Salomon era),
        mochila Eastpak (pre-Aer era)
STATUS: En transito. Identidad dual operativa.
        L4tentNoise: 14 meses activo, 0 incidentes, 0 detecciones.
        Adrian Infantes: 21 anos, empleable, invisible.
```

---

## VIII

Salio en Las Tablas cuarenta minutos despues. El sol de junio ya calentaba a las ocho y media. Camino los seiscientos metros desde el metro hasta la torre de BBVA — un edificio de cristal que parecia un iceberg invertido. Doscientos metros de altura. Cuatro mil empleados. Tres petabytes de datos financieros. Veintisiete millones de clientes.

Su madre le habia dicho que se pusiera corbata. Su padre le habia dicho que llegara diez minutos antes. Clara le habia mandado un audio de cuarenta segundos diciendo "si no te cogen es que son imbeciles y ya".

Adrian sonrio. Fue la ultima sonrisa involuntaria que recuerda con claridad.

*Delante de la torre, mirando el cristal reflejar el cielo de Madrid, tome la segunda decision real de mi vida.*

*La primera fue crear L4tentNoise. La segunda fue decidir que Adrian Infantes no seria un disfraz. Seria real. Completamente real. El hijo que cena los domingos. El ingeniero que trabaja. El ciudadano que paga impuestos y va al gimnasio y tiene un perfil de LinkedIn con foto profesional.*

*L4tentNoise seria la sombra. Y las sombras no funcionan sin un objeto solido que las proyecte.*

*Necesitaba los dos. No uno dentro del otro — los dos en paralelo. Dos protocolos en el mismo hardware. Sin filtracion de contexto.*

*El dia que uno contaminara al otro, los dos moririan.*

---

Adrian miro el edificio desde la acera de enfrente. Aun llevaba la mochila Eastpak. Aun llevaba las Nike Pegasus debajo del traje. Aun era un chico de veintiun anos de Carabanchel que nunca habia visto un rascacielos desde dentro.

Pero L4tentNoise ya estaba calculando.

*Veintisiete millones de clientes.*

*Tres petabytes.*

*Y ni un solo red teamer de IA en la plantilla.*

*Porque nadie audita lo que nadie entiende.*

---

```
BIOMETRICS [ARRIVAL]
HR:  74 BPM (elevation: excitement, not fear)
HRV: 59ms
GLU: 97 mg/dL (post-cafe con leche en bar de Las Tablas)
LOC: 40.4616N, -3.6903W (Madrid, Torre BBVA, Las Tablas)
TMP: 28C exterior / 22C interior (lobby climatizado)
STATUS: Operativo. Fase de infiltracion iniciada.
```

---

## DECISION POINT

Adrian tiene la entrevista en BBVA en diez minutos. Ha preparado dos versiones de si mismo: el candidato perfecto y la sombra que ya esta analizando el perimetro.

La pregunta es como entra.

---

**OPCION A — El camino limpio**

Adrian hace la entrevista como cualquier candidato. Responde bien. Impresiona con sus conocimientos de ML. Consigue el puesto. Pasa seis meses aprendiendo el sistema desde dentro antes de que L4tentNoise haga su primer movimiento. Paciencia maxima. Riesgo minimo. Recompensa lenta.

**OPCION B — La semilla plantada**

Adrian hace la entrevista, pero deja caer una observacion casual sobre una vulnerabilidad que "noto" en la web publica de BBVA durante su investigacion sobre la empresa. No como amenaza — como valor. "He visto que su endpoint de API para consultas de saldo expone headers que revelan la version del servidor. Podrian querer revisar eso." Lo suficiente para que lo recuerden. Lo suficiente para que lo pongan en un equipo con acceso mas alto del que le corresponde a un junior.

**OPCION C — El caballo de Troya**

Adrian no va a la entrevista como Adrian. Va como un candidato que ha preparado una demo: un mini red-team assessment de la superficie publica de BBVA, documentado profesionalmente, con vulnerabilidades reales y recomendaciones. Lo presenta como "proyecto personal de investigacion". Impresiona tanto que lo contratan directamente para el equipo de seguridad en lugar de data science. Entra por la puerta grande. Pero tambien enciende alarmas en gente que sabe reconocer a un lobo cuando lo ve.

---

>>> Elige tu camino. Cada decision tiene consecuencias.
>>> No todas las consecuencias son inmediatas.
