databaseTableList = () => {
    let query_table = [{
        name: "User",
        table: "CREATE TABLE IF NOT EXISTS `user` ( \
            `id` INT NOT NULL AUTO_INCREMENT, \
            `pseudo` VARCHAR(90) NOT NULL, \
            `lastname` VARCHAR(90) NOT NULL,\
            `firstname` VARCHAR(90) NOT NULL, \
            `password` VARCHAR(150) NOT NULL, \
            `email` VARCHAR(150) NOT NULL, \
            `age` INT NOT NULL DEFAULT 18, \
            `bio` VARCHAR(500) NOT NULL DEFAULT ' ', \
            `activation_token` VARCHAR(500) NOT NULL DEFAULT ' ', \
            `gender` VARCHAR(1) NOT NULL DEFAULT 'B', \
            `sexual_orientation` VARCHAR(1) NOT NULL DEFAULT 'B', \
            `psycho_type` VARCHAR(10) NOT NULL DEFAULT 'undefined', \
            `localisation` VARCHAR(45) NOT NULL DEFAULT 'undefined', \
            `profile_completion` INT NOT NULL DEFAULT 0, \
            `suspended` BOOLEAN NOT NULL DEFAULT 0, \
            `validated` BOOLEAN NOT NULL DEFAULT 0, \
            `fake` BOOLEAN NOT NULL DEFAULT 0, \
            `online` BOOLEAN NOT NULL DEFAULT 0, \
            `fame` INT NOT NULL DEFAULT 0, \
            `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, \
            `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, \
            `deletedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, \
            PRIMARY KEY (`id`),UNIQUE INDEX `iduser_UNIQUE` (`id` ASC))"
    }, {         
        name: "Notification",
        table: "CREATE TABLE IF NOT EXISTS `matcha`.`notif` (  \
            `id` INT NOT NULL AUTO_INCREMENT,  \
            `action_user_id` INT NOT NULL,  \
            `notified_user_id` INT NOT NULL,  \
            `categorie` VARCHAR(90) NOT NULL, \
            `title` VARCHAR(90) NOT NULL,  \
            `description` VARCHAR(90) NOT NULL,  \
            `seen` BOOLEAN NOT NULL DEFAULT 0,  \
            `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `deleted` BOOLEAN NOT NULL DEFAULT 0,  \
            PRIMARY KEY (`id`, `action_user_id`))ENGINE = InnoDB"
    }, {
        name: "Visit",
        table: "CREATE TABLE IF NOT EXISTS `matcha`.`visit` (  \
            `id` INT NOT NULL AUTO_INCREMENT,  \
            `visited_user_id` INT NOT NULL,  \
            `visit_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `visiter_user_id` INT NOT NULL,  \
            `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `deleted` BOOLEAN NOT NULL DEFAULT 0,  \
            PRIMARY KEY (`id`, `visiter_user_id`))ENGINE = InnoDB"
    },{
        name: "Report",
        table: "CREATE TABLE IF NOT EXISTS `matcha`.`report` (  \
            `id` INT NOT NULL AUTO_INCREMENT,  \
            `reported_user_id` INT NOT NULL,  \
            `report_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `reporter_user_id` INT NOT NULL,  \
            `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `deleted` BOOLEAN NOT NULL DEFAULT 0,  \
            PRIMARY KEY (`id`, `reporter_user_id`))ENGINE = InnoDB"
    }, {
        name: "Like",
        table: "CREATE TABLE IF NOT EXISTS `matcha`.`like` (  \
            `id` INT NOT NULL AUTO_INCREMENT,  \
            `like_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, \
            `liker_user_id` INT NOT NULL,  \
            `has_been_liked_user_id` INT NOT NULL,  \
            `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `deleted` BOOLEAN NOT NULL DEFAULT 0, \
            PRIMARY KEY (`id`, `has_been_liked_user_id`),  INDEX `fk_likes_user1_idx` \
            (`has_been_liked_user_id` ASC),  CONSTRAINT `fk_likes_user1`    FOREIGN KEY (`has_been_liked_user_id`) \
            REFERENCES `matcha`.`user` (`id`) \
            ON DELETE NO ACTION    ON UPDATE NO ACTION)ENGINE = InnoDB"
    }, {
        name: "Unlike",
        table: "CREATE TABLE IF NOT EXISTS `matcha`.`unlike` (  \
            `id` INT NOT NULL AUTO_INCREMENT,  \
            `unlike_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, \
            `unliker_user_id` INT NOT NULL,  \
            `has_been_unliked_user_id` INT NOT NULL,  \
            `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `deleted` BOOLEAN NOT NULL DEFAULT 0, \
            PRIMARY KEY (`id`, `has_been_unliked_user_id`),  INDEX `fk_unlikes_user1_idx` \
            (`has_been_unliked_user_id` ASC),  CONSTRAINT `fk_unlikes_user1`    FOREIGN KEY (`has_been_unliked_user_id`) \
            REFERENCES `matcha`.`user` (`id`) \
            ON DELETE NO ACTION    ON UPDATE NO ACTION)ENGINE = InnoDB"
    }, {
        name: "Dislike",
        table: "CREATE TABLE IF NOT EXISTS `matcha`.`dislike` (  \
            `id` INT NOT NULL AUTO_INCREMENT,  \
            `dislike_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, \
            `disliker_user_id` INT NOT NULL,  \
            `has_been_disliked_user_id` INT NOT NULL,  \
            `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `deleted` BOOLEAN NOT NULL DEFAULT 0, \
            PRIMARY KEY (`id`, `has_been_disliked_user_id`),  INDEX `fk_dislikes_user1_idx` \
            (`has_been_disliked_user_id` ASC),  CONSTRAINT `fk_dislikes_user1`    FOREIGN KEY (`has_been_disliked_user_id`) \
            REFERENCES `matcha`.`user` (`id`) \
            ON DELETE NO ACTION    ON UPDATE NO ACTION)ENGINE = InnoDB"
    }, {
        name: "Message",
        table: "CREATE TABLE IF NOT EXISTS `matcha`.`message` (  \
            `id` INT NOT NULL AUTO_INCREMENT,  \
            `message_text` VARCHAR(1000) NOT NULL,  \
            `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `source_user_id` INT NOT NULL,  \
            `destination_user_id` INT NOT NULL,  \
            `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `deleted` BOOLEAN NOT NULL DEFAULT 0,  \
            PRIMARY KEY (`id`, `source_user_id`, `destination_user_id`))ENGINE = InnoDB"
    }, {
        name: "Block",
        table: "CREATE TABLE IF NOT EXISTS `matcha`.`block` (  \
            `id` INT NOT NULL AUTO_INCREMENT,  \
            `blocked_user_id` INT NOT NULL,  \
            `blocker_user_id` INT NOT NULL,  \
            `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `deleted` BOOLEAN NOT NULL DEFAULT 0,  \
            PRIMARY KEY (`id`, `blocker_user_id`))ENGINE = InnoDB"
    }, {
        name: "Picture",
        table: "CREATE TABLE IF NOT EXISTS `matcha`.`picture` (  \
            `id` INT NOT NULL AUTO_INCREMENT,  \
            `path` VARCHAR(250) NOT NULL,  \
            `state` BOOLEAN NOT NULL DEFAULT 0,  \
            `user_id` INT NOT NULL,  \
            `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `deleted` BOOLEAN NOT NULL DEFAULT 0,  \
            PRIMARY KEY (`id`, `user_id`))ENGINE = InnoDB"
    }, {
        name: "interests",
        table: "CREATE TABLE IF NOT EXISTS `matcha`.`interests` (  \
            `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,  \
            `name` VARCHAR(90) NOT NULL,  \
            `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  \
            `deleted` BOOLEAN NOT NULL DEFAULT 0,  \
            PRIMARY KEY (`id`))ENGINE = InnoDB"
    }, {
        name: "user_has_interests",
        table: "CREATE TABLE IF NOT EXISTS `matcha`.`user_has_interests` (  \
            `user_id` INT NOT NULL,  \
            `interests_id` INT UNSIGNED NOT NULL,  \
            PRIMARY KEY (`user_id`, `interests_id`),  INDEX `fk_user_has_interests_interests1_idx` (`interests_id` ASC),  INDEX `fk_user_has_interests_user1_idx` (`user_id` ASC),  CONSTRAINT `fk_user_has_interests_user1`    FOREIGN KEY (`user_id`)    REFERENCES `matcha`.`user` (`id`)    ON DELETE NO ACTION    ON UPDATE NO ACTION,  CONSTRAINT `fk_user_has_interests_interests1`    FOREIGN KEY (`interests_id`)    REFERENCES `matcha`.`interests` (`id`)    ON DELETE NO ACTION    ON UPDATE NO ACTION)ENGINE = InnoDB"
    }
    ];

    return query_table;
}


module.exports = {
    databaseTableList
}