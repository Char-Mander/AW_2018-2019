SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `facebluff`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id_user` int(11) UNSIGNED NOT NULL PRIMARY KEY,
	`email`	varchar(100)	NOT NULL UNIQUE KEY,
	`password`	varchar(100)	NOT NULL,
	`nombre_completo`	varchar(100)	NOT NULL,
	`sexo`	varchar(6)	NOT NULL,
	`fecha_nacimiento`	date	NOT NULL,
  `puntos` int(11) UNSIGNED NOT NULL DEFAULT 0,
	`imagen_perfil`	LONGBLOB	NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aplicacion`
--

CREATE TABLE `solicitudes` (
  `id_user1` int(11) UNSIGNED NOT NULL,
  `action_id_user` int(11) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `amigos` (
  `id_user1` int(11) UNSIGNED NOT NULL,
  `id_user2` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `preguntas` (
  `id` int(11) UNSIGNED NOT NULL PRIMARY KEY,
  `texto` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas`
--

CREATE TABLE `respuestas` (
  `id_pregunta` int(11) UNSIGNED NOT NULL,
  `id` int(11) UNSIGNED NOT NULL PRIMARY KEY,
  `texto` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas_propias`
--

CREATE TABLE `respuestas_propias` (
  `id_pregunta` int(11) UNSIGNED NOT NULL,
  `id_respuesta` int(11) UNSIGNED NOT NULL,
  `id_user` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas_adivinadas``
--

CREATE TABLE `respuestas_adivinadas` (
  `id_pregunta` int(11) UNSIGNED NOT NULL,
  `id_respuesta` int(11) UNSIGNED NOT NULL,
  `id_amigo` int(11) UNSIGNED NOT NULL,
  `id_propio` int(11) UNSIGNED NOT NULL,
  `correct` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `vista` tinyint(1) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- �ndices para tablas volcadas
--

--
-- Indices de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD UNIQUE KEY `unique_users_id` (`id_user1`,`action_id_user`),
  ADD KEY `id_user1` (`id_user1`),
  ADD KEY `action_id_user` (`action_id_user`);

--
--	Inidices de la tabla `amigos`
--
ALTER TABLE `amigos`
	ADD UNIQUE KEY `unique_friends_id` (`id_user1`, `id_user2`),
	ADD KEY `id_user1` (`id_user1`),
	ADD KEY `id_user2` (`id_user2`);
  
--
-- Indices de la tabla `respuestas_adivinadas`
--
ALTER TABLE `respuestas_adivinadas`
  ADD KEY `id_pregunta` (`id_pregunta`);

--
-- Indices de la tabla `respuestas_propias`
--
ALTER TABLE `respuestas_propias`
  ADD UNIQUE KEY `unique_question_answer_user` (`id_pregunta`, `id_user`, `id_respuesta`),
  ADD KEY `id_pregunta` (`id_pregunta`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_respuesta` (`id_respuesta`);



--
-- AUTO_INCREMENT de las tablas volcadas
--


--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;


--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;


--
-- AUTO_INCREMENT de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;




--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `respuestas`
--
ALTER TABLE `respuestas`
    ADD CONSTRAINT `id_pregunta_fk_respuestas` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `respuestas_propuestas`
--
ALTER TABLE `respuestas_propias`
    ADD CONSTRAINT `id_pregunta_fk_propias` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT `id_respuesta_fk_propias` FOREIGN KEY (`id_respuesta`) REFERENCES `respuestas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT `id_user_fk_propias` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `respuestas_adivinadas`
--
ALTER TABLE `respuestas_adivinadas`
  ADD CONSTRAINT `id_pregunta_fk_adivinada` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `id_respuesta_fk_adivinada` FOREIGN KEY (`id_respuesta`) REFERENCES `respuestas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `id_amigo_fk` FOREIGN KEY (`id_amigo`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `id_propio_fk` FOREIGN KEY (`id_propio`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `aplicacion`
--
ALTER TABLE `solicitudes`
  ADD CONSTRAINT `id_user1_fk_solicitudes` FOREIGN KEY (`id_user1`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `id_users_fk_solicitudes` FOREIGN KEY (`action_id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
  
--
-- Filtros para la tabla `aplicacion`
--
ALTER TABLE `amigos`
  ADD CONSTRAINT `id_user1_fk_amigos` FOREIGN KEY (`id_user1`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `id_user2_fk_amigos` FOREIGN KEY (`id_user2`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;