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
	`imagen_perfil`	BLOB	NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aplicacion`
--

CREATE TABLE `solicitudes` (
  `id_user1` int(11) UNSIGNED NOT NULL,
  `status` tinyint(1) UNSIGNED DEFAULT NULL,
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
-- Estructura de tabla para la tabla `respuestas_propuestas`
--

CREATE TABLE `respuestas_propuestas` (
  `id_pregunta` int(11) UNSIGNED NOT NULL,
  `id` int(11) UNSIGNED NOT NULL PRIMARY KEY,
  `texto` varchar(200) NOT NULL,
  `correct` tinyint(1) NOT NULL

) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas_respondidas`
--

CREATE TABLE `preguntas_respondidas` (
  `id_pregunta` int(11) UNSIGNED NOT NULL,
  `id_respuesta` int(11) UNSIGNED NOT NULL PRIMARY KEY,
  `id_amigo` int(11) UNSIGNED NOT NULL,
  `id_propio` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------




--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD UNIQUE KEY `unique_users_id` (`id_user1`,`id_user2`),
  ADD KEY `id_user1` (`id_user1`),
  ADD KEY `id_user2` (`id_user2`),
  ADD KEY `action_id_user` (`action_id_user`);

--
--	Inidices de la tabla `amigos`
--
ALTER TABLE `amigos`
	ADD UNIQUE KEY `unique_friends_id` (`id_user1`, `id_user2`),
	ADD KEY `id_user1` (`id_user1`),
	ADD KEY `id_user2` (`id_user2`);
  
--
-- Indices de la tabla `respuestas_propuestas`
--
ALTER TABLE `respuestas_propuestas`
  ADD KEY `id_pregunta` (`id_pregunta`);

--
-- Indices de la tabla `preguntas_respondidas`
--
ALTER TABLE `preguntas_respondidas`
  ADD KEY `id_pregunta` (`id_pregunta`),
  ADD KEY `id_amigo` (`id_amigo`),
  ADD KEY `id_propio` (`id_propio`);



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
-- AUTO_INCREMENT de la tabla `respuestas_propuestas`
--
ALTER TABLE `respuestas_propuestas`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;




--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `respuestas_propuestas`
--
ALTER TABLE `respuestas_propuestas`
    ADD CONSTRAINT `id_pregunta_fk_propuestas` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `preguntas_respondidas`
--
ALTER TABLE `preguntas_respondidas`
  ADD CONSTRAINT `id_pregunta_fk_realizadas` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `id_amigo_fk` FOREIGN KEY (`id_amigo`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `id_propio_fk` FOREIGN KEY (`id_propio`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `aplicacion`
--
ALTER TABLE `solicitudes`
  ADD CONSTRAINT `id_user1_fk_solicitudes` FOREIGN KEY (`id_user1`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `id_user2_fk_solicitudes` FOREIGN KEY (`id_user2`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
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