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
  `id_user` int(11) UNSIGNED NOT NULL,
	`email`	varchar(100)	NOT NULL,
	`password`	varchar(100)	NOT NULL,
	`nombre_completo`	varchar(100)	NOT NULL,
	`sexo`	varchar(6)	NOT NULL,
	`fecha_nacimiento`	date	NOT NULL,
	`imagen_perfil`	varchar(100)	NULL,
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aplicacion`
--

CREATE TABLE `aplicacion` (
  `id_user1` int(11) UNSIGNED NOT NULL,
  `id_user2` int(11) UNSIGNED NOT NULL,
  `status` tinyint(3) UNSIGNED DEFAULT NULL,
  `action_id_user` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `preguntas` (
  `id` int(11) UNSIGNED NOT NULL,
  `id_user` int(11) UNSIGNED NOT NULL,
  `texto` varchar(200) NOT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas_propuestas`
--

CREATE TABLE `respuestas_propuestas` (
  `id_pregunta` int(11) UNSIGNED NOT NULL,
  `id` int(11) UNSIGNED NOT NULL,
  `texto` varchar(200) NOT NULL,
  `correct` tinyint(1) NOT NULL

) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas_realizadas`
--

CREATE TABLE `respuestas_realizadas` (
  `id_pregunta` int(11) UNSIGNED NOT NULL,
  `id_respondida` int(11) UNSIGNED NOT NULL,
  `id_amigo` int(11) UNSIGNED NOT NULL,
  `id_propio` int(11) UNSIGNED NOT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------




--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `aplicacion`
--
ALTER TABLE `aplicacion`
  ADD UNIQUE KEY `unique_users_id` (`id_user1`,`id_user2`),
  ADD KEY `id_user1` (`id_user1`),
  ADD KEY `id_user2` (`id_user2`),
  ADD KEY `action_id_user` (`action_user_id`);


--
-- Indices de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`);

--
-- Indices de la tabla `respuestas_propuestas`
--
ALTER TABLE `respuestas_propuestas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pregunta` (`id_pregunta`);

--
-- Indices de la tabla `respuestas_propuestas`
--
ALTER TABLE `respuestas_realizadas`
  ADD PRIMARY KEY (`id_respondida`),
  ADD KEY `id_pregunta` (`id_pregunta`);



--
-- AUTO_INCREMENT de las tablas volcadas
--


--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;


--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;


--
-- AUTO_INCREMENT de la tabla `respuestas_propuestas`
--
ALTER TABLE `respuestas_propuestas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;




--
-- Restricciones para tablas volcadas
--


--
-- Filtros para la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD CONSTRAINT `fk_id_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `respuestas_propuestas`
--
ALTER TABLE `respuestas_propuestas`
    ADD CONSTRAINT `fk_id_pregunta` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `respuestas_realizadas`
--
ALTER TABLE `respuestas_realizadas`
  ADD CONSTRAINT `fk_id_pregunta` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `aplicacion`
--
ALTER TABLE `aplicacion`
  ADD CONSTRAINT `fk_id_user1` FOREIGN KEY (`id_user1`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
  ADD CONSTRAINT `fk_id_user2` FOREIGN KEY (`id_user2`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
  ADD CONSTRAINT `fk_id_users` FOREIGN KEY (`action_id_user) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
    

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;