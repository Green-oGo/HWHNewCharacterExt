// ==UserScript==
// @name             HWHNewCharacterExt
// @name:en          HWHNewCharacterExt
// @name:ru          HWHNewCharacterExt
// @namespace        HWHNewCharacterExt
// @version          2.80
// @description      Extension for HeroWarsHelper script
// @description:en   Extension for HeroWarsHelper script
// @description:ru   Расширение для скрипта HeroWarsHelper
// @author           ZingerY, Green
// @license          Copyright Green
// @icon             https://i.ibb.co/9k7g3wqW/icon.png
// @match            https://www.hero-wars.com/*
// @match            https://www.hero-wars.cn/*
// @match            https://apps-1701433570146040.apps.fbsbx.com/*
// @run-at           document-start
// @downloadURL https://github.com/Green-oGo/HWHNewCharacterExt/raw/refs/heads/main/HWHNewCharacterExt.user.js
// @updateURL https://github.com/Green-oGo/HWHNewCharacterExt/raw/refs/heads/main/HWHNewCharacterExt.user.js
// ==/UserScript==

(function () {
    if (!this.HWHClasses) {
        console.log('%cObject for extension not found', 'color: red');
        return;
    }

    console.log('%cStart Extension ' + GM_info.script.name + ', v' + GM_info.script.version + ' by ' + GM_info.script.author, 'color: red');
    const { addExtentionName } = HWHFuncs;
    addExtentionName(GM_info.script.name, GM_info.script.version, GM_info.script.author);

    const { popup, confShow, setProgress, I18N, countdownTimer, getSaveVal, setSaveVal } = HWHFuncs;

    const { i18nLangData } = HWHData;

    const { WinFixBattle } = HWHClasses;

    const i18nLangDataEn = {
        NEW_CHARACTER: 'New Character',
        NEW_CHARACTER_TITLE: 'Complete quests for a new hero or titan',
        NEW_CHARACTER_NO_EVENT: 'The event is not active',
        NEW_CHARACTER_SOMETHING_WENT_WRONG:`<span style="color: red;">Oops! Something went wrong</span>
          <br> Please try again
          <br> If you keep seeing this, wait for the next extension update`,
        NEW_CHARACTER_SELECT_ACTION: 'Select an action',
        NT_TITAN_EVENT: '<span style="color: White; font-size: 35px;"> The Titan Awakens </span> <br>',
        //NT_COLLECT_TITANS: 'Сollect the Titans',
        //NT_COLLECT_TITANS_TITLE: 'Сollecting the Titans of the maximum rank by purchasing fragments in the store',
        //NT_COLLECT_HEROES: 'Сollect the Heroes',
        //NT_COLLECT_HEROES_TITLE: 'Сollecting the Heroes of the maximum rank by purchasing fragments in the store',
        //NT_COLLECT_TOTEM_SKILLS: 'Сollect totem skills',
        //NT_COLLECT_TOTEM_SKILLS_TITLE: 'Get the influence skill of the maximum rank by purchasing fragments in the store',
        NT_COLLECT_TITANS_PROGRESS: '<span style="color: LimeGreen;"> {counter} </span> titans left to collect',
        NT_COLLECT_TOTEM_SKILLS_PROGRESS: '<span style="color: LimeGreen;"> {counter} </span> influence skills left to collect <br> Collecting...',
        //NT_TITANS_COLLECTED: 'All titans have been collected',
        //NT_TOTEM_SKILLS_COLLECTED: 'All influence skills have been collected',
        NT_TITANS_AND_TOTEM_SKILLS_COLLECTED: 'Titans and Totem influence skills have been collected',
        NT_CHAPTER_NOT_AVAILABLE: '<span style="color: red;"> Chapter unavailable </span> <br> Complete the previous chapter',
        NT_COLLECT_HEROES_PROGRESS: '<span style="color: LimeGreen;"> {counter} </span> heroes left to collect <br> Collecting...',
        NT_HEROES_COLLECTED: 'All heroes have been collected',
        //NT_COLLECT_EVERYTHING: 'Collect everything',
        //NT_COLLECT_EVERYTHING_TITLE: 'Collect heroes, titans, totems, pets',
        NT_BOSS_WAS_KILLED: `The Chapter <span style="color: LimeGreen; font-family: 'Times New Roman';"> {chapterNumber} </span> boss didn\'t appreciate our health-conscious approach... to his health.`,
        NT_BOSS_WAS_KILLED_SET_PROGRESS_1: 'All done. <span style="color: LimeGreen;">Boss defeated</span>. Collecting trophies...',
        NT_BOSS_WAS_KILLED_SET_PROGRESS_2: '<br>Oh no, our loot is too much for this humble bag\'s capacity.',
        NT_BOSS_WAS_KILLED_SET_PROGRESS_3: '<br>Urgently calling the porters guild.',
        NT_BOSS_WAS_KILLED_SET_PROGRESS_4: '<br>All of it!',
        NT_BOSS_WAS_KILLED_SET_PROGRESS_5: '<br><span style="color: LimeGreen;">Stand by.</span> Arrival in approximately seconds ',
        NT_BOSS_WAS_NOT_KILLED: `The Chapter <span style="color: LimeGreen; font-family: 'Times New Roman';"> {chapterNumber} </span> boss was not killed <br> Reload the game and try to kill the boss yourself`,
        NT_COMPLETE_CHAPTER: 'Complete the chapter',
        NT_COMPLETE_CHAPTER_START: 'Kick off the Magic Vibe',
        NT_COMPLETE_CHAPTER_CANCEL: 'Hogwarts cancellation',
        NT_COMPLETE_CHAPTER_TITLE: 'Complete an available chapter',
        NT_ALL_CHAPTERS_COMPLETED: 'All chapters completed',
        NT_NOT_ENOUGH_BUFF:
          `Not enough buff to complete Chapter <span style="color: LimeGreen; font-family: 'Times New Roman';"> {chapterNumber} </span> <br>
          Have - <span style="color: red;"> {buffAmount} </span> Need - <span style="color: LimeGreen;"> {invasionBuff} </span>`,

        NT_ENTER_TITAN_IDS:
          `To kick off the magic vibe in chapter <span style="color: LimeGreen; font-family: 'Times New Roman';"> {chapterNumber} </span>,
          choose an attacking team or enter <span style="color: red;"> 5 </span> titan IDs using commas`,
        NT_ENTER_HERO_IDS:
          `To kick off the magic vibe in chapter <span style="color: LimeGreen; font-family: 'Times New Roman';"> {chapterNumber} </span>,
          choose an attacking team or enter <span style="color: red;"> 5 </span> hero IDs using commas <br>
          <span style="color: red;"> Heroes who failed the vibe check: </span><br>
          {nameMissingHeroes}<br>`,

        NT_MUST_FIVE_TITANS: 'There must be <span style="color: red;"> 5 </span> titans',
        NT_MUST_FIVE_HEROES: 'There must be <span style="color: red;"> 5 </span> heroes',
        NT_MUST_ONLY_NUMBERS: 'The list must contain only numbers and commas',
        NT_LETS_START: 'Let\'s start...',
        NT_LETS_CONTINUE: 'let\'s continue...',
        NT_COMPLETE_TITAN_TASKS_TITLE: 'Complete event tasks: collect heroes, titans, totem skills, pets',
        NT_OUTDATED_VERSION_OF_SCRIPT:
          `<span style="color: red;"> Outdated version of HeroWarsHelper </span><br>
          Please update the script`,
        NT_MISSION_PROGRESS: 'Taking out <span style="color: LimeGreen;"> {missionNumber} </span> enemy team',
        NT_MISSION_PROGRESS_BOSS: 'Let\'s wipe <span style="color: LimeGreen;">the boss</span> as a team!',
        NT_GET_TITAN_IDS: 'Titan IDs',
        NT_GET_TITAN_IDS_TITLE: 'Get a list of titan IDs',
        NT_GET_TITAN_IDS_MESSAGE: `<span style="color: White; font-size: 25px;"> Id - Name </span>`,
        NT_WATER_TITANS: 'Water Titans',
        NT_EARTH_TITANS: 'Earth Titans',
        NT_FIRE_TITANS: 'Fire Titans',
        NT_LIGHT_TITANS: 'Light Titans',
        NT_DARK_TITANS: 'Dark Titans',
        NT_DISTORTION_TITANS: 'Distortion Titans',
        NHR_NOTHING_HERE: 'There\'s nothing here yet. Please wait.',
        NHR_HERO_EVENT: '<span style="color: White; font-size: 35px;">Rise of a New Hero</span> <br>',
        NHR_COMPLETE_TASKS: 'Complete the tasks',
        NHR_COMPLETE_TASKS_TITLE: 'Complete event tasks: collect heroes, buy pets, spend coins',
        NHR_TASKS_COMPLETED: '<span style="color: LimeGreen;"> The tasks have been completed </span>',
        NHR_LIVES_ARE_OVER: `Failed to complete chapter <span style="color: LimeGreen; font-family: 'Times New Roman';"> {chapterNumber} </span>. Lives are over. Try again`,
        NHR_SHOPPING: `Shopping, shopping, shopping`,
        NHR_NOTHING_HERE_1: 'What\'s this? Where is it? When? Booooooooooosss...',
        NHR_NOTHING_HERE_2: 'Nobody\'s heeere! ',
        NHR_NOTHING_HERE_3: 'And nobody here either.',
        NHR_NOTHING_HERE_4: 'If he\'s not there, then what\'s supposed to be here?',
        NHR_COMPLETE_CHAPTER_N1: `Raid for Chapter <span style="font-family: 'Times New Roman';">I</span>`,
        NHR_COMPLETE_CHAPTER_N1_TITLE: 'Complete chapter I one time',
        NHR_COMPLETE_CHAPTER_N1_COMPLETED: `Chapter <span style="color: LimeGreen; font-family: 'Times New Roman';">I</span> raid completed`,
        NHR_CHAPTER_N1_RAID: `Starting <span style="color: LimeGreen;">{raidNumber}</span> / {remainingRaids} raid chapter <span style="font-family: 'Times New Roman';">I</span>`,
        NHR_MAKE_OTHER_TASKS: '<br>Moving on to other quests',
        NHR_GET_HERO_IDS: 'Hero IDs',
        NHR_GET_HERO_IDS_TITLE: 'Get a list of hero IDs',
        NHR_GET_HERO_IDS_MESSAGE: `<span style="color: red;"> Heroes not eligible for the event: </span><br>
          <div style="max-width: 400px; word-wrap: break-word;">{nameMissingHeroes}</div> <br>
          <span style="color: White; font-size: 25px;">Population census: Name - Id</span>`,
        NHR_SPEND_VALOR_COINS: 'Spend Valor Coins',
        NHR_SPEND_VALOR_COINS_TITLE: 'Spend all available Valor Coins',
        NHR_NOT_ENOUGH_COINS: '<span style="font-size: 30px;">Not enough coins</span><br> <span style="color: LimeGreen; font-size: 30px;">No money, no honey </span>',
        NHR_SPEND_VALOR_COINS_RESULT:
          `<span style="font-size: 30px;">Exchanged Valor Coin <span style="color: LimeGreen;">{numberOfExchanges}</span> times </span><br>
          <span style="font-size: 30px;"> Result: <br>
          Sapphire Medallion: <span style="color: LimeGreen;">{sapphireMedallion}</span> <br>
          Soul stones: <span style="color: LimeGreen;">{fragmentHero}</span>`,
        NHR_SPEND_VALOR_COINS_MESSAGE: 'Exchange all available Coins of Valor?',

        NHR_APPLY: 'Spend it before I change my mind',
        NHR_NOT_APPLY: 'Oh no, I\'ve already changed my mind',
        NHR_COMPLETE_CHAPTER: `Let\'s begin to complete <span style="color: LimeGreen; font-family: 'Times New Roman';"> {chapterNumber} </span> chapter`,
        NHR_COMPLETE_CHAPTER_N1_MESSAGE: `Complete chapter <span style="color: LimeGreen; font-family: 'Times New Roman';"> I </span>?`,
        NHR_COMPLETE_CHAPTER_N1_APPLY: 'Click if you\'re brave',
        NHR_COMPLETE_CHAPTER_N1_NOT_APPLY: 'Nah, I\'m losing my nerve',

        NHR_TEAM_HERO_N0: 'You can enter it here. Or there. We\'re not picky',
        NHR_TEAM_HERO_MY_DARLING: `<span style="color: #FFB347; font-size: 25px; font-style: italic; font-family: 'Georgia';">My Precious</span>`,
        NT_TEAM_TITAN_N0: 'Type wherever you want. We\'ll figure it out',

        NHR_INCORRECT_TEAM: `You\'ve entered something cute and a bit confusing <br>
          But we don't judge. Just do your best. You\'ve got this!`,
        NHR_INCORRECT_TEAM_HEROES_ARE_UNAVAILABLE: `<span style="color: Red;"> You're trying to pick people who aren't on our guest list</span> <br>
          Check your list and try again. If the error keeps showing up, maybe you're just tired.
          Take a break, have some tea and sandwiches. Then come back with fresh energy`,
        NHR_ARCHDEMON: 'Archdemon',
        NHR_ATTACK_ARCHDEMON: 'Attack the Archdemon',
        NHR_NO_CHAPTER: 'The Archdemon is unavailable. Complete at least one chapter.',

        NHR_CHAPTER:`Chapter`,
        NHR_SELECT_CHAPTER: 'Select a chapter',
        NHR_NEXT: 'Next',
        NHR_NO_TALISMAN: '<span style="color: Red;"> The required talisman is missing </span>',
        NHR_BOUGHT_TALISMAN: '<span style="color: LimeGreen;"> A talisman has been purchased</span>',
        NHR_ARCHDEMON_IS_PREPARED: 'We tried our best. We did what we did. The game will be synced without your permission. Go to the chapter and attack the Archdemon.',
        NHR_SELECT_TALISMAN: 'Choose a talisman',
        NHR_SELECT_PETS: 'Select pets',
        NHR_SPEND_VALOR_COINS_PROGRESS: 'Eyes closed, deal sealed: <span style="color: LimeGreen;">{exchangeCounter}</span> / {maximumCounter}',
        NHR_SPEND_VALOR_COINS_PROGRESS_2: 'And throw in a little extra',
        NHR_SPEND_VALOR_COINS_PROGRESS_3: 'Just pocket change',
        NHR_WARNING_MESSAGE: `<span style="color: Red;"> Attention, attention! Hear ye, hear ye! </span> <br>
          You're using an untested version of the extension.
          If something goes wrong, just wait until the author deigns to wake up, reads every single message saying the script isn't working,
          scratches his ass, and finally fixes where he screwed up.`,
        NHR_ANY_OF_THE_TALISMANS: `<span style="color: LimeGreen;"> Oh wow, a choice? <br> Eh, just take whatever </span>`,
        NHR_ANY_OF_THE_TALISMANS_TITLE: `If it needs explaining, it's not worth explaining`,
        NHR_SELECT_TITAN_SPIRIT_SKILLS: `Choose
          <br><span style="color: DeepSkyBlue;">Elemental</span> and <span style="color: LimeGreen;"> Primal </span>
          <br>affinity skills`,
        NHR_REMOVE_TUTORIAL_MESSAGES: `Activating 'Been there, done that' mode. See ya, tutorial!`,
        NHR_SHOULD_SAVE_PETS: `<span style="color: LimeGreen;"> Save the fluffsters </span>`,
        NHR_SHOULD_SAVE_PETS_TITLE: `Explain what 'save' or 'fluffsters' means?`,
        NHR_BOUGHT_CAPITAL_TALISMAN: `<span style="color: LimeGreen;"> I am Guan Yin, and Guan Yin has done this. </span>
        <br> The game will be restarted without your permission. The Capital Talisman has been purchased, so you're on your own from here`,
        NHR_ABYSS_TOTAL: `{sealName}:`,
        NHR_ABYSS_FREE: `<span style="color: LimeGreen;">Free</span>`,
        NHR_ABYSS_COST: `Seals: <span style="color: {color};"> {seals} </span> / {cost}`,
        NHR_ABYSS_NEED_RELIC: `Enhancement: <span style="color: red;"> {haveBuff} </span> / {needBuff}`,
        NHR_NOT_ENOUGH_SEALS: `<span style="color: red;"> Not enough Abyss Seals </span>`,
        NHR_ROLL_TALISMANS: `Talisman reroll #<span style="color: LimeGreen;">{rerollCounter}</span>`,
        NHR_KEEP_ANY_TALISMAN: `The talisman we wanted never dropped. <span style="color: LimeGreen;"> Take what we can get </span>`,
        NHR_RESET_CHAPTER: `Let's start over. This isn't working.`,
    };

    i18nLangData['en'] = Object.assign(i18nLangData['en'], i18nLangDataEn);

    const i18nLangDataRu = {
        NEW_CHARACTER: 'Новый персонаж',
        NEW_CHARACTER_TITLE: 'Выполнять задания для нового героя или титана',
        NEW_CHARACTER_NO_EVENT: 'Ивент не активен',
        NEW_CHARACTER_SOMETHING_WENT_WRONG: `<span style="color: red;">В процессе выполнения произошла ошибка</span>
          <br> Повторите действие еще раз
          <br> Если ошибка повторяется, подождите обновления расширения`,
        NEW_CHARACTER_SELECT_ACTION: 'Выберите действие',
        NT_TITAN_EVENT: '<span style="color: White; font-size: 35px;"> Пробуждение Титана </span> <br>',
        //NT_COLLECT_TITANS: 'Собрать титанов',
        //NT_COLLECT_TITANS_TITLE: 'Собрать титанов максимального ранга, покупая фрагменты в магазине',
        //NT_COLLECT_HEROES: 'Собрать героев',
        //NT_COLLECT_HEROES_TITLE: 'Собрать героев максимального ранга, покупая фрагменты в магазине',
        //NT_COLLECT_TOTEM_SKILLS: 'Собрать тотемы',
        //NT_COLLECT_TOTEM_SKILLS_TITLE: 'Собрать навыки тотемов максимального ранга, покупая фрагменты в магазине',
        NT_COLLECT_TITANS_PROGRESS: 'Осталось собрать титанов: <span style="color: LimeGreen;"> {counter} </span> шт.',
        NT_COLLECT_TOTEM_SKILLS_PROGRESS: 'Осталось собрать навыков тотемов: <span style="color: LimeGreen;"> {counter} </span> шт. <br> Собираем...',
        //NT_TITANS_COLLECTED: 'Титаны собраны',
        //NT_TOTEM_SKILLS_COLLECTED: 'Все навыки влияния собраны',
        NT_TITANS_AND_TOTEM_SKILLS_COLLECTED: 'Титаны и навыки влияния тотемов собраны',
        NT_CHAPTER_NOT_AVAILABLE: '<span style="color: red;"> Глава не доступна </span> <br> Завершите предыдущую главу',
        NT_COLLECT_HEROES_PROGRESS: 'Осталось собрать героев: <span style="color: LimeGreen;"> {counter} </span> шт. <br> Собираем...',
        NT_HEROES_COLLECTED: 'Все герои собраны',
        //NT_COLLECT_EVERYTHING: 'Собрать все',
        //NT_COLLECT_EVERYTHING_TITLE: 'Собрать героев, титанов, тотемы, питомцев',
        NT_BOSS_WAS_KILLED: `Босс <span style="color: LimeGreen; font-family: 'Times New Roman';"> {chapterNumber} </span> главы не пережил нашего искреннего интереса к его здоровью`,
        NT_BOSS_WAS_KILLED_SET_PROGRESS_1: 'Готовенько. <span style="color: LimeGreen;">Босс повержен</span>. Собираем трофеи...',
        NT_BOSS_WAS_KILLED_SET_PROGRESS_2: '<br>О нет, размеры добычи превосходят скромные возможности этого мешка.',
        NT_BOSS_WAS_KILLED_SET_PROGRESS_3: '<br>Срочно вызываем гильдию носильщиков!',
        NT_BOSS_WAS_KILLED_SET_PROGRESS_4: '<br>Всю!',
        NT_BOSS_WAS_KILLED_SET_PROGRESS_5: '<br><span style="color: LimeGreen;">Ожидайте.</span> Прибытие, примерно секунд через ',
        NT_BOSS_WAS_NOT_KILLED: `Босса <span style="color: LimeGreen; font-family: 'Times New Roman';"> {chapterNumber} </span> главы не убили <br> Перезагрузите игру, и попробуйте убить босса самостоятельно`,
        NT_COMPLETE_CHAPTER: 'Пройти главу',
        NT_COMPLETE_CHAPTER_START: 'Старт магического движняка',
        NT_COMPLETE_CHAPTER_CANCEL: 'Отмена Хогвартса',
        NT_COMPLETE_CHAPTER_TITLE: 'Пройти доступную главу',
        NT_ALL_CHAPTERS_COMPLETED: 'Все главы пройдены',
        NT_NOT_ENOUGH_BUFF:
          `Недостаточно усиления для прохождения <span style="color: LimeGreen; font-family: 'Times New Roman';"> {chapterNumber} </span> главы <br>
          Имеем - <span style="color: red;"> {buffAmount} </span>  Необходимо - <span style="color: LimeGreen;"> {invasionBuff} </span>`,
        NT_ENTER_TITAN_IDS:
          `Для старта магического движняка в <span style="color: LimeGreen; font-family: 'Times New Roman';"> {chapterNumber} </span> главе
          выберите атакующую команду или введите <span style="color: red;"> 5 </span> id титанов  через запятые`,

        NT_ENTER_HERO_IDS:
          `Для старта магического движняка в <span style="color: LimeGreen; font-family: 'Times New Roman';"> {chapterNumber} </span> главе
          выберите атакующую команду или введите <span style="color: red;"> 5 </span> id героев  через запятые <br>
          <span style="color: red;"> Герои, не прошедшие фейс-контроль: </span><br>
          {nameMissingHeroes}<br>`,
        NT_MUST_FIVE_TITANS:'Должно быть <span style="color: red;"> 5 </span> титанов',
        NT_MUST_FIVE_HEROES:'Должно быть <span style="color: red;"> 5 </span> героев',
        NT_MUST_ONLY_NUMBERS: 'Список должен содержать только цифры и запятые',
        NT_LETS_START: 'Начинаем начинать...',
        NT_LETS_CONTINUE: 'Продолжаем продолжать...',
        NT_COMPLETE_TITAN_TASKS_TITLE: 'Выполнить задания ивента: собрать героев, титанов, навыки тотемов, питомцев',
        NT_OUTDATED_VERSION_OF_SCRIPT:
          `<span style="color: red;"> Устаревшая версия HeroWarsHelper </span><br>
          Пожалуйста, обновите скрипт`,
        NT_MISSION_PROGRESS: 'Сносим <span style="color: LimeGreen;"> {missionNumber} </span> команду противника',
        NT_MISSION_PROGRESS_BOSS: 'Пакуем <span style="color: LimeGreen;">босса</span> всем коллективом!',
        NT_GET_TITAN_IDS: 'Id титанов',
        NT_GET_TITAN_IDS_TITLE: 'Получить список Id титанов',
        NT_GET_TITAN_IDS_MESSAGE: `<span style="color: White; font-size: 25px;"> Id - Имя </span>`,
        NT_WATER_TITANS: 'Титаны Воды',
        NT_EARTH_TITANS: 'Титаны Земли',
        NT_FIRE_TITANS: 'Титаны Огня',
        NT_LIGHT_TITANS: 'Титаны Света',
        NT_DARK_TITANS: 'Титаны Тьмы',
        NT_DISTORTION_TITANS: 'Титаны Искажения',
        NHR_NOTHING_HERE: 'Здесь пока ничего нет. Ожидайте',
        NHR_HERO_EVENT: '<span style="color: White; font-size: 35px;">Восхождение Нового Героя</span> <br>',
        NHR_COMPLETE_TASKS: 'Выполнить задания',
        NHR_COMPLETE_TASKS_TITLE: 'Выполнить задания ивента: собрать героев, купить питомцев, потратить монеты',
        NHR_TASKS_COMPLETED: '<span style="color: LimeGreen;"> Задания выполнены </span>',
        NHR_LIVES_ARE_OVER:
          `Дорогой дневник, мне не подобрать слов, чтобы описать боль и унижение, которые были получены при походе на босса <span style="color: LimeGreen; font-family: 'Times New Roman';"> {chapterNumber} </span> главы.
          Наши богатыри были втянуты в яростный бой, точнее не бой, а именно пиздилку, мочилово, где всё равнялось, даже морды с асфальтом.
          И после нескольких дней этого хаоса и резни наступил бесславный и постыдный конец нашему походу.<br> <br>
          Конец. Конец. Концы в воду! Давай по новой!`,
        NHR_SHOPPING: 'Шопимся, шопимся, шопимся',
        NHR_NOTHING_HERE_1: 'А чё это? А где? А когда? Хазяяяяяяяииинн...',
        NHR_NOTHING_HERE_2: 'Здеся никого нет!',
        NHR_NOTHING_HERE_3: 'И здесь тоже нет.',
        NHR_NOTHING_HERE_4: 'Если там нет, то чё здесь должно быть?',
        NHR_COMPLETE_CHAPTER_N1: `Рейд <span style="font-family: 'Times New Roman';">I</span> главы`,
        NHR_COMPLETE_CHAPTER_N1_TITLE: 'Пройти I главу 1 раз',
        NHR_COMPLETE_CHAPTER_N1_COMPLETED: `Рейд <span style="color: LimeGreen; font-family: 'Times New Roman';">I</span> главы выполнен`,
        NHR_CHAPTER_N1_RAID: `Выполняем <span style="color: LimeGreen;">{raidNumber}</span> / {remainingRaids} рейд <span style="font-family: 'Times New Roman';">I</span> главы`,
        NHR_MAKE_OTHER_TASKS: '<br> Приступаем к выполнению других заданий',
        NHR_GET_HERO_IDS: 'Id героев',
        NHR_GET_HERO_IDS_TITLE: 'Получить список Id героев',
        NHR_GET_HERO_IDS_MESSAGE: `<span style="color: red;"> Герои, не допущенные к событию: </span><br>
        <div style="max-width: 400px; word-wrap: break-word;">{nameMissingHeroes}</div> <br>
        <span style="color: White; font-size: 25px;">Перепись населения: Имя - Id</span>`,
        NHR_SPEND_VALOR_COINS: 'Потратить монеты доблести',
        NHR_SPEND_VALOR_COINS_TITLE: 'Потратить все имеющиеся монеты доблести',
        NHR_NOT_ENOUGH_COINS: '<span style="font-size: 30px;">Нэт Монэт</span><br> <span style="color: LimeGreen; font-size: 30px;">Ноу мани - ноу хани</span>',
        NHR_SPEND_VALOR_COINS_RESULT:
          `<span style="font-size: 30px;">Обменяли монеты доблести <span style="color: LimeGreen;">{numberOfExchanges}</span> раз </span><br>
          <span style="font-size: 30px;"> Получили: <br>
          <span style="color: LimeGreen;">3</span> магнитoфoна,  <span style="color: LimeGreen;">3</span> кинoкамеры заграничных,
          <span style="color: LimeGreen;">3</span> пoртсигара отечественных, куртка замшевая - <span style="color: LimeGreen;">три</span> куртки,
          сапфировый медальон - <span style="color: LimeGreen;">{sapphireMedallion}</span>, камни души - <span style="color: LimeGreen;">{fragmentHero}</span>`,
        NHR_SPEND_VALOR_COINS_MESSAGE: 'Потратить все имеющиеся монеты доблести?',

        NHR_APPLY: 'Потратить, пока не передумал',
        NHR_NOT_APPLY: 'А нет, не успел. Уже передумал',

        NHR_COMPLETE_CHAPTER: `Проходим <span style="color: LimeGreen; font-family: 'Times New Roman';"> {chapterNumber} </span> главу`,
        NHR_COMPLETE_CHAPTER_N1_MESSAGE: `Выполнить рейд <span style="color: LimeGreen; font-family: 'Times New Roman';"> I </span> главы?`,
        NHR_COMPLETE_CHAPTER_N1_APPLY: 'Жми, если смелый',
        NHR_COMPLETE_CHAPTER_N1_NOT_APPLY: 'Нет, чёт я очкую',

        NHR_TEAM_HERO_N0: 'Вводить сюда. Или туда. Мы не настаиваем',
        NHR_TEAM_HERO_MY_DARLING: `<span style="color: #FFB347; font-size: 25px; font-style: italic; font-family: 'Georgia';">Моя Прелесть</span>`,
        NT_TEAM_TITAN_N0: 'Вводите где хотите. Мы потом сами разберёмся',

        NHR_INCORRECT_TEAM: `Вы ввели что-то милое и слегка непонятное. <br>
          Но мы не осуждаем. Постарайтесь. У Вас получится!`,
        NHR_INCORRECT_TEAM_HEROES_ARE_UNAVAILABLE: `<span style="color: Red;"> Вы пытаетесь выбрать тех, кого нет на нашей вечеринке.</span> <br>
          Проверьте ваш список, и попробуйте ещё раз. Если ошибка повторяется, возможно Вы просто устали.
          Отдохните, попейте чайку с бутерами. А потом с новыми силами попробуйте снова`,
        NHR_ARCHDEMON: `Архидемон`,
        NHR_ATTACK_ARCHDEMON: `Атаковать Архидемона`,
        NHR_NO_CHAPTER: `Архидемон недоступен. Пройдите хотя бы одну главу`,
        NHR_CHAPTER: `Глава`,
        NHR_SELECT_CHAPTER: `Выберите главу`,
        NHR_NEXT: `Дальше`,
        NHR_NO_TALISMAN: `<span style="color: Red;"> Нет необходимого талисмана </span>`,
        NHR_BOUGHT_TALISMAN:`<span style="color: LimeGreen;"> Купили талисман </span>`,
        NHR_ARCHDEMON_IS_PREPARED: `Старались, как могли. Сделали, что сделали. Игра будет синхронизирована без вашего разрешения. Зайдите в главу, и атакуйте Архидемона`,
        NHR_SELECT_TALISMAN: `Выберите талисман`,
        NHR_SELECT_PETS: `Выберите питомцев`,
        NHR_SPEND_VALOR_COINS_PROGRESS: 'Меняю, не глядя: <span style="color: LimeGreen;">{exchangeCounter}</span> / {maximumCounter}',
        NHR_SPEND_VALOR_COINS_PROGRESS_2: 'Ну, и на помидорчики',
        NHR_SPEND_VALOR_COINS_PROGRESS_3: 'Тут ток на помидорчики',
        NHR_WARNING_MESSAGE: `<span style="color: Red;"> Внимание, внимание! </span> <br>
          Вы используете не протестированную версию расширения.
          Если что-то пойдет не так, просто дождитесь, пока афтор, тобишь я, соизволит проснуться, прочитает все до единого сообщения, что скрипт не работает.
          Почешет жопу, и наконец то исправит где накосячил.`,
        NHR_ANY_OF_THE_TALISMANS: `<span style="color: LimeGreen;"> Мне выбирать штоли? <br> Неее. Что дадут — то и бери </span>`,
        NHR_ANY_OF_THE_TALISMANS_TITLE: `Если надо объяснять, то не надо объяснять`,
        NHR_SELECT_TITAN_SPIRIT_SKILLS: `Выберите
          <br><span style="color: DeepSkyBlue;">стихийный</span> и <span style="color: LimeGreen;"> первородный </span>
          <br>навыки влияния тотема`,
        NHR_REMOVE_TUTORIAL_MESSAGES: `Активируем режим «Я уже всё знаю». До свидания, обучение!`,
        NHR_SHOULD_SAVE_PETS: `<span style="color: LimeGreen;"> Запомнить пушистикоф </span>`,
        NHR_SHOULD_SAVE_PETS_TITLE: `Подсказать что такое "запомнить" или "пушистикоф"?`,
        NHR_BOUGHT_CAPITAL_TALISMAN: `<span style="color: LimeGreen;"> Я — Гуаньинь! И Гуаньинь выполнила свою работу. </span>
        <br> Игра будет перезагружена без вашего разрешения. Талисман капитала куплен, а дальше как нибудь сами`,
        NHR_ABYSS_TOTAL: `{sealName}:`,
        NHR_ABYSS_FREE: `<span style="color: LimeGreen;">Бесплатно</span>`,
        NHR_ABYSS_COST: `Печати: <span style="color: {color};"> {seals} </span> / {cost}`,
        NHR_ABYSS_NEED_RELIC: `Усиление: <span style="color: red;"> {haveBuff} </span> / {needBuff}`,
        NHR_NOT_ENOUGH_SEALS: `<span style="color: red;"> Не хватает Печатей Бездны </span>`,
        NHR_ROLL_TALISMANS: `Обновление талисманов №<span style="color: LimeGreen;">{rerollCounter}</span>`,
        NHR_KEEP_ANY_TALISMAN: `Нужный талисман так и не выпал. <span style="color: LimeGreen;"> Берем чё дают </span>`,
        NHR_RESET_CHAPTER: `Давай по новой Миша. Все не то`,
    };

    i18nLangData['ru'] = Object.assign(i18nLangData['ru'], i18nLangDataRu);

    const romanNumerals = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    let invasionInfoId = 0;
    ///////////////////////////////////////////////////////////////////////////////////////////////

    // Добавление кнопоки в окно Разное
    const { othersPopupButtons } = HWHData;
    othersPopupButtons.push({
        get msg() {
            return I18N('NEW_CHARACTER');
        },
        get title() {
            return I18N('NEW_CHARACTER_TITLE');
        },
        result: async function () {
            //getTeamButton2
            //await popup.confirm(I18N('NHR_WARNING_MESSAGE'));
            //let shopId = 1088;
            //let coins = {value: 100};
            //console.log(talismanId);
            //await buyRandomHeroes (2024, {value: 90}, 'hero');
            //await buyRandomHeroes (2023, {value: 90}, 'titan');
            //let r = getHeroIdsMissingInShop();
            //console.log(r);
            //await attackArchdemon();
            await onClickNewCharacterButton();
        },
        color: 'pink',
    });

    async function onClickNewCharacterButton() {
        if (compareVersions(scriptInfo.version, '2.390') < 0) {
            confShow(`${I18N('NT_OUTDATED_VERSION_OF_SCRIPT')}`);
            return;
        }
        console.log(scriptInfo.version);
        let invasionInfo = await Caller.send('invasion_getInfo');
        if (invasionInfo) {
            invasionInfoId = invasionInfo.id;
            console.log("invasionInfoId " + invasionInfoId);
            let chapters = Object.values(lib.data.invasion.chapter).filter((e) => e.invasionId === invasionInfoId);
            const startDate = new Date((chapters[0].startDate).replace(' ', 'T') + 'Z');
            const todayDate = Date.now();
            console.log(startDate);
            console.log(todayDate);

            if (todayDate < startDate) {
                confShow(`${I18N('NEW_CHARACTER_NO_EVENT')}`);
                return;
            }
            let titanIvent = false;
            for (let chapter of chapters) {
                if (chapter.settings?.unitType === 'titan') {
                    titanIvent = true;
                    break;
                }
            }

            if (titanIvent) {
//if (false) {
                await onClickNewTitanButton();
            } else {
                await onClickNewHeroButton();
            }
        } else {
            confShow(`${I18N('NEW_CHARACTER_NO_EVENT')}`);
        }
    }

    async function onClickNewHeroButton() {
        const popupButtons = [
            {
                get msg() {
                    return I18N('NHR_COMPLETE_TASKS');
                },
                get title() {
                    return I18N('NHR_COMPLETE_TASKS_TITLE');
                },
                result: async function () {
                    await completeHerosTasks();
                },
                color: 'green',
            },
            {
                get msg() {
                    return I18N('NT_COMPLETE_CHAPTER');
                },
                get title() {
                    return I18N('NT_COMPLETE_CHAPTER_TITLE');
                },
                result: async function () {
                    await completeChapter();
                },
                color: 'blue',
            },
            {
                get msg() {
                    return I18N('NHR_ARCHDEMON');
                },
                get title() {
                    return I18N('NHR_ATTACK_ARCHDEMON');
                },
                result: async function () {
                    await attackArchdemon();
                },
                color: 'red',
            },
            {
                get msg() {
                    return I18N('NHR_COMPLETE_CHAPTER_N1');
                },
                get title() {
                    return I18N('NHR_COMPLETE_CHAPTER_N1_TITLE');
                },
                result: async function () {
                    await completeChapterN1();
                },
                color: 'pink',
            },

            {
                get msg() {
                    return I18N('NHR_GET_HERO_IDS');
                },
                get title() {
                    return I18N('NHR_GET_HERO_IDS_TITLE');
                },
                result: function () {
                    getAllHeroIDs();
                },
                color: 'pink',
            },
            {
                get msg() {
                    return I18N('NHR_SPEND_VALOR_COINS');
                },
                get title() {
                    return I18N('NHR_SPEND_VALOR_COINS_TITLE');
                },
                result: async function () {
                    await spendValorCoins();
                },
                color: 'pink',
            },
        ];
        popupButtons.push({ result: false, isClose: true });
        const answer = await popup.confirm(I18N('NHR_HERO_EVENT'), popupButtons);
        if (typeof answer === 'function') {
            answer();
        }
    }

    async function onClickNewTitanButton() {
        const popupButtons = [
            {
                get msg() {
                    return I18N('NHR_COMPLETE_TASKS');
                },
                get title() {
                    return I18N('NT_COMPLETE_TITAN_TASKS_TITLE');
                },
                result: async function () {
                    await completeTitansTasks();
                },
                color: 'green',
            },
            {
                get msg() {
                    return I18N('NT_COMPLETE_CHAPTER');
                },
                get title() {
                    return I18N('NT_COMPLETE_CHAPTER_TITLE');
                },
                result: async function () {
                    await completeChapter();
                },
                color: 'blue',
            },
            {
                get msg() {
                    return I18N('NHR_GET_HERO_IDS');
                },
                get title() {
                    return I18N('NHR_GET_HERO_IDS_TITLE');
                },
                result: function () {
                    getAllHeroIDs();
                },
                color: 'pink',
            },
            {
                get msg() {
                    return I18N('NT_GET_TITAN_IDS');
                },
                get title() {
                    return I18N('NT_GET_TITAN_IDS_TITLE');
                },
                result: function () {
                    getAllTitanIDs();
                },
                color: 'pink',
            },
            {
                get msg() {
                    return I18N('NHR_SPEND_VALOR_COINS');
                },
                get title() {
                    return I18N('NHR_SPEND_VALOR_COINS_TITLE');
                },
                result: async function () {
                    await spendValorCoins();
                },
                color: 'pink',
            },
        ];
        popupButtons.push({ result: false, isClose: true });
        const answer = await popup.confirm(I18N('NT_TITAN_EVENT'), popupButtons);
        if (typeof answer === 'function') {
            answer();
        }
    }


    async function completeHerosTasks() {
        setProgress(I18N('NT_LETS_START'), false);
        await new Promise((e) => setTimeout(e, 3000));
        let chapters = Object.values(lib.data.invasion.chapter).filter((e) => e.invasionId === invasionInfoId && e?.isArchdemon !== true);
        let farmedChapters = (await Caller.send('invasion_getInfo')).farmedChapters.map(Number);
        if (farmedChapters.length == 0) {
            //Убрать сообщения обучения
            setProgress(I18N('NHR_REMOVE_TUTORIAL_MESSAGES'), false);
            await new Promise((e) => setTimeout(e, 3000));
            await removeTutorialMessages();

            //Пройти I главу
            setProgress(I18N('NHR_COMPLETE_CHAPTER', { chapterNumber: romanNumerals[1]}), false);
            await new Promise((e) => setTimeout(e, 3000));
            await firstHeroicChapterRaid();
            setProgress(I18N('NT_LETS_CONTINUE'), false);
            await new Promise((e) => setTimeout(e, 3000));
        }

        //Пройти II главу
        if (farmedChapters.length <= 1 && chapters[1]?.requirements == null) {
            setProgress(I18N('NHR_COMPLETE_CHAPTER', { chapterNumber: romanNumerals[2]}), false);
            await new Promise((e) => setTimeout(e, 3000));
            await secondHeroicChapterRaid();
            setProgress(I18N('NT_LETS_CONTINUE'), false);
            await new Promise((e) => setTimeout(e, 3000));
        }

        //Собрать героев
        await collectHeroes();
        setProgress(`${I18N('NT_HEROES_COLLECTED')} ${I18N('NHR_MAKE_OTHER_TASKS')}`, false);
        await new Promise((e) => setTimeout(e, 3000));

        //Добрать бои (Выполнить рейды I главы)
        await performRaidsIfNeeded(firstHeroicChapterRaid);

        //Сбросить главу
        await Caller.send('invasion_resetChapter');

        setProgress('', true);
        await popup.confirm(I18N('NHR_TASKS_COMPLETED'));

        //Возврат в меню "Новый герой"
        returnToNewHeroMenu();
    }

    async function completeTitansTasks() {
        setProgress(I18N('NT_LETS_START'), false);
        await new Promise((e) => setTimeout(e, 3000));
        let chapters = Object.values(lib.data.invasion.chapter).filter((e) => e.invasionId === invasionInfoId && e?.isArchdemon !== true);
        let farmedChapters = (await Caller.send('invasion_getInfo')).farmedChapters.map(Number);
        if (farmedChapters.length == 0) {
            //Убрать сообщения обучения
            setProgress(I18N('NHR_REMOVE_TUTORIAL_MESSAGES'), false);
            await new Promise((e) => setTimeout(e, 3000));
            await removeTutorialMessages();

            //Пройти I главу
            setProgress(I18N('NHR_COMPLETE_CHAPTER', { chapterNumber: romanNumerals[1]}), false);
            await new Promise((e) => setTimeout(e, 3000));
            await firstTitanChapterRaid();
            setProgress(I18N('NT_LETS_CONTINUE'), false);
            await new Promise((e) => setTimeout(e, 3000));
        }

        //Пройти II главу
        if (farmedChapters.length <= 1 && chapters[1]?.requirements == null) {
            setProgress(I18N('NHR_COMPLETE_CHAPTER', { chapterNumber: romanNumerals[2]}), false);
            await new Promise((e) => setTimeout(e, 3000));
            await firstHeroicChapterRaid();
            setProgress(I18N('NT_LETS_CONTINUE'), false);
            await new Promise((e) => setTimeout(e, 3000));
        }

        //Собрать титанов и тотемы
        await collectTitansAndTotemFragments();
        setProgress(`${I18N('NT_TITANS_AND_TOTEM_SKILLS_COLLECTED')} ${I18N('NHR_MAKE_OTHER_TASKS')}`, false);
        await new Promise((e) => setTimeout(e, 3000));

        //Собрать героев и питомцев
        await collectHeroes();
        setProgress(`${I18N('NT_HEROES_COLLECTED')} ${I18N('NHR_MAKE_OTHER_TASKS')}`, false);
        await new Promise((e) => setTimeout(e, 3000));

        //Добрать бои (Выполнить рейды I главы)
        await performRaidsIfNeeded(firstTitanChapterRaid);

        //Сбросить главу
        await Caller.send('invasion_resetChapter');

        setProgress('', true);
        await popup.confirm(I18N('NHR_TASKS_COMPLETED'));
        //Возврат в меню "Новый титан"
        returnToNewTitanMenu();
    }
    async function completeChapterN1() {
        let answer = await popup.confirm(
            I18N('NHR_COMPLETE_CHAPTER_N1_MESSAGE'),
            [
                { msg: I18N('NHR_COMPLETE_CHAPTER_N1_APPLY'), result: true, color: 'green' },
                { msg: I18N('NHR_COMPLETE_CHAPTER_N1_NOT_APPLY'), result: false, isCancel: true, color: 'red' },
            ],
        );
        if (!answer) {
            //Возврат в меню "Новый герой"
            returnToNewHeroMenu();
            return;
        }
        await firstHeroicChapterRaid();
        setProgress('', true);
        await popup.confirm(I18N('NHR_COMPLETE_CHAPTER_N1_COMPLETED'));
        //Возврат в меню "Новый герой"
        returnToNewHeroMenu();
    }

    function returnToNewHeroMenu() {
        onClickNewHeroButton();
    }

    function returnToNewTitanMenu() {
        onClickNewTitanButton();
    }

    function returnToNewCharacterMenu() {
        onClickNewCharacterButton();
    }

    async function firstHeroicChapterRaid() {
        let titanOrHero = 'hero';
        let missionRaid = true;
        await completeChapter(missionRaid, titanOrHero);
    }

    async function secondHeroicChapterRaid() {
        let titanOrHero = 'hero';
        let missionRaid = true;
        let secondHeroicChapter = true;
        await completeChapter(missionRaid, titanOrHero, secondHeroicChapter);
    }

    async function firstTitanChapterRaid() {
        let titanOrHero = 'titan';
        let missionRaid = true;
        await completeChapter(missionRaid, titanOrHero);
    }

    async function completeChapter(missionRaid = false, titanOrHero = '', secondHeroicChapter = false) {
        //Получить состояние на карте
        let invasionInfo = await Caller.send('invasion_getInfo');
        let chapters = Object.values(lib.data.invasion.chapter).filter((e) => e.invasionId === invasionInfoId && e?.isArchdemon !== true);
        const chapterIds = new Set(chapters.map(c => c.id));
        console.log(chapters);
        let farmedChapters = invasionInfo.farmedChapters.map(Number).filter(id => chapterIds.has(id));

        const relicId = Object.values(lib.data.invasion.list).find((e) => e.id == invasionInfoId).settings.relicId;
        console.log('relicId ' + relicId);
        const relicLevel = (await Caller.send('workshop_getInfo')).relics.find((e) => e.id == relicId).level;
        console.log('relicLevel ' + relicLevel);
        let buffAmount = relicLevel <= 1 ? 0 : relicLevel * 10;

        console.log(invasionInfo);
        console.log('invasionInfoId ' + invasionInfoId);
        console.log('farmedChapters ', JSON.stringify(farmedChapters));
        console.log('buffAmount ' + buffAmount);



        let chapterId = 0;
        let invasionBuff = 0;
        let chapterNumber = 0;

        if (chapters.length == farmedChapters.length) {
            confShow(I18N('NT_ALL_CHAPTERS_COMPLETED'));
            return;
        }
        if (missionRaid == false) {
            for (let chapter of chapters) {
                if (!farmedChapters.includes(chapter.id)) {
//if (chapter.id == 2999000024) { //первая глава
//if (chapter.id == 2683000025) { //вторая глава
//if (chapter.id == 2683000026) { //третья глава
//if (chapter.id == 2999000027) { //четвертая глава
                    chapterId = chapter.id;
                    if (chapter.requirements?.invasionRelic) {
                        invasionBuff = chapter.requirements.invasionRelic * 10;
                    }
                    titanOrHero = chapter.settings.unitType;
                    chapterNumber = chapters.indexOf(chapter)+1;
                    break;
                }
            }
        }
        //Рейд мисси
        if (missionRaid == true) {
            if (secondHeroicChapter == true){
                chapterId = chapters[1].id;
                chapterNumber = 2;
            } else {
                for (let chapter of chapters) {
                    if (chapter.settings.unitType === titanOrHero) {
                        chapterId = chapter.id;
                        chapterNumber = chapters.indexOf(chapter)+1;
                        break;
                    }
                }
            }
        }

        console.log('chapterId ' + chapterId);
        console.log('invasionBuff ' + invasionBuff);
        console.log('titanOrHero ' + titanOrHero);
        console.log('chapterNumber ' + chapterNumber);

        if (buffAmount < invasionBuff) {
            await popup.confirm(I18N('NT_NOT_ENOUGH_BUFF', { chapterNumber: romanNumerals[chapterNumber], buffAmount, invasionBuff}));
            //Возврат в меню "Новый персонаж"
            returnToNewCharacterMenu();
            return;
        }
        if (titanOrHero === 'hero' ) {
            await completeHeroesChapter(chapters, chapterId, chapterNumber, farmedChapters, missionRaid);
        }
        if (titanOrHero === 'titan' ) {
            await completeTitansChapter(chapters, chapterId, chapterNumber, farmedChapters, missionRaid);
        }
        if (!missionRaid) {
            //Возврат в меню "Новый персонаж"
            returnToNewCharacterMenu();
        }
    }

    async function completeHeroesChapter(chapters, chapterId, chapterNumber, farmedChapters, missionRaid = false) {
        /*Питомцы
        6000 - Фенрис   //6005 - Альбрус
        6001 - Оливер	//6006 - Аксель
        6002 - Мерлин   //6007 - Бисквит
        6003 - Мара	    //6008 - Хорус
        6004 - Каин	    //6009 - Векс*/
        //Атакующие герои: Галахад, Тристан, Лирия, Кира, Себастьян.
        //Каскад Орион Август Электра Флафи
        let heroAttackingTeams = {heroes: [[2, 54, 67, 3, 48], [60,34,18,69,33]],
                                  pets: [[6005,6000,6001,6007,6009], [6001,6002,6003,6006,6008]]};

        let titanOrHero = 'hero';
        let heroIds = heroAttackingTeams.heroes[0];
        let pets = heroAttackingTeams.pets[0];
        let talismanId = 0;
        console.log('Герои для рейдов ', JSON.stringify(heroIds));
        console.log('Питомци для рейдов ', JSON.stringify(pets));


        if (missionRaid == false) {
            //Кнопка ввод Id героев, что необходимо собрать
            console.log("chapterNumber: chapterNumber " + chapterNumber);
            let resultGetTeamButton = await getTeamButton(heroAttackingTeams.heroes, chapterNumber);
            if (resultGetTeamButton === 'cancel'){
                return;
            }
            heroIds = resultGetTeamButton.team;
            let teamIndex = resultGetTeamButton.teamIndex;
            console.log('heroIds ', JSON.stringify(heroIds));
            console.log('teamIndex ', JSON.stringify(teamIndex));
            //Получить id питомцев
            pets = await selectPets(heroAttackingTeams.pets?.[teamIndex] ?? []);
            if (pets === 'cancel'){
                return;
            }
            console.log('pets ', JSON.stringify(pets));

            //Получить id талисмана
            talismanId = await chooseTalisman();
            if (talismanId === 'cancel'){
                return;
            }
            console.log('talismanId ', JSON.stringify(talismanId));
            setProgress(I18N('NT_LETS_START'), false);
            await new Promise((e) => setTimeout(e, 3000));
        }

        //Активировать главу
        let chapterInfo = await Caller.send({ name: 'invasion_setActiveChapter', args: { chapterId: chapterId } });

        //Id миссии
        let firstMissionId = chapterInfo.invasion.actions[0].payload.id;
        let missionId = firstMissionId;
        let lastMissionId = chapterInfo.invasion.actions[7].payload.id;
        let missionNumber = 1;

        //Жизни
        let lives = chapterInfo.invasion.lives;
        console.log('firstMissionId ' + firstMissionId);
        console.log('missionId ' + missionId);
        console.log('lives ' + lives);
        console.log(heroIds);

        while (lives > 0) {
            //Купить героев
            await buyHeroesAndPets(missionNumber, lives, heroIds, pets);
            if (missionNumber == 8) {
                console.log('%cКонтрольная закупка перед боссом (продать ненужное, купить нужное)', 'color: green; font-weight: bold;');
                await buyHeroesAndPets(missionNumber, lives, heroIds, pets);
            }
            //Текущая миссия босс или нет
            let boss = false;

            //Атаковать / не атаковать босса
            if (missionId == lastMissionId) {
                if (missionRaid == true && farmedChapters.includes(chapterId)) {
                    return;
                }
                //Произвести атаку босса, если его ни разу не убили
                boss = true;
            }

            //Получить атакующую команду
            let have = await getAttackingTeam();
            let heroes = have.heroes;
            let havePets = have.other;
            let allHeroes = have.allHeroes;
            let pet;
            let petsFavor = {};

            const haveAllAttackingTeams = (arr, values) => {
                return values.every(v => arr.includes(v));
            };
            if (haveAllAttackingTeams(allHeroes, heroIds)) {
                heroes = heroIds;
            }
            console.log('allHeroes ', JSON.stringify(allHeroes));
            console.log('heroes ', JSON.stringify(heroes));

            if (havePets.length > 0) {
                //Основной питомец первый в списке питомцев
                let mainPet = heroAttackingTeams.pets[0];
                if (havePets.includes(mainPet)) {
                    pet = mainPet;
                } else {
                    pet = havePets[0];
                }
                //Покровительство
                const petLib = lib.getData('pet');
                for (let heroId of heroes) {
                    /** Поиск питомца для героя */
                    for (let petId of havePets) {
                        if (petLib[petId].favorHeroes.includes(heroId)) {
                            petsFavor[heroId] = petId;
                            havePets = havePets.filter((e) => e != petId);
                            break;
                        };
                    }
                }
            }

            //Проходим миссию
            if (!boss) {
                setProgress(I18N('NT_MISSION_PROGRESS', {missionNumber: missionNumber}), false);
            } else {
                setProgress(I18N('NT_MISSION_PROGRESS_BOSS'), false);
            }
            await new Promise((e) => setTimeout(e, 2000));

            let error = await attackHeroMission(missionId, chapterId, heroes, pet, boss, petsFavor);
            if (error) {
                await popup.confirm(I18N('NEW_CHARACTER_SOMETHING_WENT_WRONG'));
                return;
            }

            //Результат атаки
            let invasionInfo = await Caller.send('invasion_getInfo');

            //Результат атаки босса
            if (boss) {
                if (missionRaid) {
                    return;
                }
                if (invasionInfo.farmedChapters.map(Number).includes(chapterId)) {
                    await popup.confirm(I18N('NT_BOSS_WAS_KILLED', { chapterNumber: romanNumerals[chapterNumber]}));
                    //Сбросить главу
                    await Caller.send('invasion_resetChapter')
                } else {
                    await popup.confirm(I18N('NT_BOSS_WAS_NOT_KILLED', { chapterNumber: romanNumerals[chapterNumber]}));
                }
                return;
            }

            //Купить талисман
            if (invasionInfo?.talismans?.length === 0) {
                const talismanRerollsLeft = invasionInfo?.talismanRerollsLeft ?? 0;
                console.log('talismanRerollsLeft: ' + talismanRerollsLeft);
                const shouldResetChapter = await manageTalisman(talismanRerollsLeft, talismanId, missionRaid, chapterId);
                //Сбрасываем главу если не купили талисман
                if (shouldResetChapter){
                    setProgress(I18N('NHR_RESET_CHAPTER'), false);
                    await new Promise((e) => setTimeout(e, 1000));
                    invasionInfo = await resetChapter(chapterId);
                }
            }

            let missions = Object.values(invasionInfo.actions);
            let nextMissionIndex = missions.findIndex(e => e.payload.wins === 0);
            if (nextMissionIndex !== -1) {
                missionId = missions[nextMissionIndex].payload.id;
                missionNumber = nextMissionIndex + 1;
                console.log('missionId ' + missionId);
                console.log('missionNumber ' + missionNumber);
            }
            lives = invasionInfo.lives;
            console.log('lives ' + lives);
        }
        if (lives == 0) {
            setProgress('', true);
            await popup.confirm(I18N('NHR_LIVES_ARE_OVER', { chapterNumber: romanNumerals[chapterNumber]}));
            return;
        }
    }



    async function completeTitansChapter(chapters, chapterId, chapterNumber, farmedChapters, missionRaid = false) {
        /*Навыки тотемов:
        elemental                  primal
        4500 - Последний Всполох   4506 - Пульс Древних
        4502 - Ледниковый Период   4507 - Первородное Рвение
        4503 - Гнев Недр           4508 - Эгида Эха
        4509 - Танец Пламени       4514 - Тройной Круговорот
        4510 - Шепот Глубин        4515 - Зов Стихий
        4511 - Гул Скал */

        const elementalSkils = [4500,4502,4503,4509,4510,4511];
        const primalSkils = [4506,4507,4508,4514,4515];
        let titanAttackingTeams = {heroes: [[4030,4031,4033,4042,4043], [4003,4004,4040,4043,4044], [4023,4024,4022,4043,4040]], totemSkilsIds: [4502, 4506]};

        let titanOrHero = 'titan';
        let titanIds = titanAttackingTeams.heroes[0];
        //Навыки тотемов, что необходимо собрать
        let totemSkilsIds = titanAttackingTeams.totemSkilsIds;

        if (missionRaid == false) {
            //Id тотемов, что необходимо собрать
            totemSkilsIds = await chooseTitanSpiritSkills();
            if (totemSkilsIds === 'cancel') {
                return;
            }

            console.log('totemSkilsIds ', JSON.stringify(totemSkilsIds));
            //Id титанов, что необходимо собрать
            titanIds = await getTeamButton(titanAttackingTeams.heroes, chapterNumber);
            if (titanIds === 'cancel') {
                return;
            }
            console.log('titanIds ', JSON.stringify(titanIds));
            setProgress(I18N('NT_LETS_START'), false);
            await new Promise((e) => setTimeout(e, 3000));
        }

        //Активировать главу
        let chapterInfo = await Caller.send({ name: 'invasion_setActiveChapter', args: { chapterId: chapterId } });

        //Id миссии
        let firstMissionId = chapterInfo.invasion.actions[0].payload.id;
        let missionId = firstMissionId;
        let lastMissionId = chapterInfo.invasion.actions[7].payload.id;
        let missionNumber = 1;

        //Жизни
        let lives = chapterInfo.invasion.lives;
        console.log('firstMissionId ' + firstMissionId);
        console.log('missionId ' + missionId);
        console.log('lives ' + lives);

        while (lives > 0) {
            //Купить титанов и фрагменты тотемов
            await buyTitansAndTotemSkils (missionNumber, lives, titanIds, totemSkilsIds);
            if (missionNumber == 8) {
                console.log('%cКонтрольная закупка перед боссом (продать ненужное, купить нужное)', 'color: green; font-weight: bold;');
                await buyTitansAndTotemSkils (missionNumber, lives, titanIds, totemSkilsIds);
            }
            //Текущая миссия босс или нет
            let boss = false;

            //Атаковать / не атаковать босса
            if (missionId == lastMissionId ) {
                if (missionRaid == true && farmedChapters.includes(chapterId)) {
                    return;
                }
                //Произвести атаку босса, если его ни разу не убили
                boss = true;
            }
            //Получить атакующую команду
            let have = await getAttackingTeam();
            let heroes = have.heroes;
            let titanSkil = have.other;
            let allHeroes = have.allHeroes;

            console.log('heroes ', JSON.stringify(heroes));
            let spiritSkills = new Array();
            if (titanSkil.length > 0) {
                for (let ts of titanSkil) {
                    if (elementalSkils.includes(ts)) {
                        spiritSkills.push(['elemental', ts]);
                    }
                    if (primalSkils.includes(ts)) {
                        spiritSkills.push(['primalSkils', ts]);
                    }
                }
            }
            let firstSpiritSkills = Object.fromEntries(spiritSkills);

            //Проходим миссию
            if (!boss) {
                setProgress(I18N('NT_MISSION_PROGRESS', {missionNumber: missionNumber}), false);
            } else {
                setProgress(I18N('NT_MISSION_PROGRESS_BOSS'), false);
            }
            await new Promise((e) => setTimeout(e, 2000));
            let error = await attackTitanMission(missionId, chapterId, heroes, firstSpiritSkills, boss);
            if (error) {
                await popup.confirm(I18N('NEW_CHARACTER_SOMETHING_WENT_WRONG'));
                return;
            }

            //Результат атаки
            let invasionInfo = await Caller.send('invasion_getInfo');

            //Результат атаки босса
            if (boss) {
                if (missionRaid) {
                    return;
                }
                if (invasionInfo.farmedChapters.map(Number).includes(chapterId)) {
                    await popup.confirm(I18N('NT_BOSS_WAS_KILLED', { chapterNumber: romanNumerals[chapterNumber]}));
                    //Сбросить главу
                    await Caller.send('invasion_resetChapter')
                } else {
                    await popup.confirm(I18N('NT_BOSS_WAS_NOT_KILLED', { chapterNumber: romanNumerals[chapterNumber]}));
                }
                return;
            }

            let missions = Object.values(invasionInfo.actions);
            let nextMissionIndex = missions.findIndex(e => e.payload.wins === 0);
            if (nextMissionIndex !== -1) {
                missionId = missions[nextMissionIndex].payload.id;
                missionNumber = nextMissionIndex + 1;
                console.log('missionId ' + missionId);
                console.log('missionNumber ' + missionNumber);
            }
            lives = invasionInfo.lives;
            console.log('lives ' + lives);
        }
        if (lives == 0) {
            setProgress('', true);
            await popup.confirm(I18N('NHR_LIVES_ARE_OVER', { chapterNumber: romanNumerals[chapterNumber]}));
            return;
        }
    }
    async function collectTitansAndTotemFragments() {
        //Получить состояние на карте
        let invasionInfo = await Caller.send('invasion_getInfo');
        let farmedChapters = invasionInfo.farmedChapters.map(Number);
        console.log('invasionInfoId ' + invasionInfoId);
        console.log('farmedChapters ', JSON.stringify(farmedChapters));

        //Получить id первой главый
        let chapters = Object.values(lib.data.invasion.chapter).filter((e) => e.invasionId === invasionInfoId);
        let chapterId = getChapterId(chapters, 'titan');
        console.log('chapterId ' + chapterId);

        for (let attempt = 1; attempt <= 15; attempt++) {
            //Титаны, что необходимо собрать
            let titanIdsToBuy = await getTitanIdsToBuy();

            //Навыки тотемов, что необходимо собрать
            let totemSkilsIdsToBuy = await getTitanSkillIdsToBuy();

            if (titanIdsToBuy.length == 0 && totemSkilsIdsToBuy.length == 0) {
                setProgress('', true);
                confShow(I18N('NT_TITANS_AND_TOTEM_SKILLS_COLLECTED'));
                return;
            }

            setProgress(
                I18N('NT_COLLECT_TITANS_PROGRESS', { counter: titanIdsToBuy.length }) +
                '<br>' +
                I18N('NT_COLLECT_TOTEM_SKILLS_PROGRESS', { counter: totemSkilsIdsToBuy.length }),
                false
            );
            await new Promise((e) => setTimeout(e, 3000));

            //Активировать главу
            let chapterInfo = await Caller.send({ name: 'invasion_setActiveChapter', args: { chapterId: chapterId } });

            //Id миссии
            let firstMissionId = chapterInfo.invasion.actions[0].payload.id;
            let missionId = firstMissionId;
            let lastMissionId = chapterInfo.invasion.actions[7].payload.id;
            let missionNumber = 1;

            //Жизни
            let lives = chapterInfo.invasion.lives;
            console.log('firstMissionId ' + firstMissionId);
            console.log('missionId ' + missionId);
            console.log('lives ' + lives);

            //Резервные титаны, для добавления в покупки: Солярис, Ияри, Тенебрис, Брустар
            let reserveTitans = [4043, 4042, 4033, 4030];

            //Id титанов, что необходимо собрать
            let titanIdsLength = 4;
            let titanIds = titanIdsToBuy.slice(0, titanIdsLength);
            if (titanIds.length < titanIdsLength) {
                titanIds.push(...reserveTitans.slice(0, titanIdsLength - titanIds.length));
            }

            //Id навыков тотемов, что необходимо собрать
            let totemSkilsIdsLength = 2;
            let totemSkilsIds = totemSkilsIdsToBuy.slice(0, totemSkilsIdsLength);

            console.log(titanIds);
            console.log(totemSkilsIds);

            while (lives > 0) {
                //Купить титанов и фрагменты тотемов
                let result = await buyTitansAndTotemSkils (missionNumber, lives, titanIds, totemSkilsIds);

                //Выйти, если босс побежден и полностью собрали титанов и тотемы.
                if (result && farmedChapters.includes(chapterId)) {
                    break;
                }
                //Текущая миссия босс или нет
                let boss = false;

                //Произвести атаку босса, если его ни разу не убили
                if (!farmedChapters.includes(chapterId)) {
                    if (missionId == lastMissionId) {
                        boss = true;
                        console.log('%cАтакуем босса ', 'color: green; font-weight: bold;');
                    }
                } else {
                    //Не атаковать босса, если его уже убили
                    if (missionId == lastMissionId) {
                        break;
                    }
                }

                //Получить атакующую команду
                let have = await getAttackingTeam();
                let heroes = have.heroes;
                let titanSkil = have.other;
                let allHeroes = have.allHeroes;
                let firstSpiritSkills = {};

                //Проходим миссию
                if (!boss) {
                    setProgress(I18N('NT_MISSION_PROGRESS', {missionNumber: missionNumber}), false);
                } else {
                    setProgress(I18N('NT_MISSION_PROGRESS_BOSS'), false);
                }
                await new Promise((e) => setTimeout(e, 2000));
                let error = await attackTitanMission(missionId, chapterId, heroes, firstSpiritSkills, boss);
                if (error) {
                    await popup.confirm(I18N('NEW_CHARACTER_SOMETHING_WENT_WRONG'));
                    return;
                }
                //Убили / не убили босса, вышли с "while"
                if (boss == true) {
                    break;
                }
                //Результат атаки
                let invasionInfo = await Caller.send('invasion_getInfo');
                farmedChapters = invasionInfo.farmedChapters.map(Number);
                let missions = Object.values(invasionInfo.actions);
                let nextMissionIndex = missions.findIndex(e => e.payload.wins === 0);
                if (nextMissionIndex !== -1) {
                    missionId = missions[nextMissionIndex].payload.id;
                    missionNumber = nextMissionIndex + 1;
                    console.log('missionId ' + missionId);
                    console.log('missionNumber ' + missionNumber);
                }
                lives = invasionInfo.lives;
                console.log('lives ' + lives);
            }
        }
        await popup.confirm(I18N('NEW_CHARACTER_SOMETHING_WENT_WRONG'));
        return;
    }

    async function collectHeroes() {
        //Получить состояние на карте
        let invasionInfo = await Caller.send('invasion_getInfo');
        let farmedChapters = invasionInfo.farmedChapters.map(Number);
        console.log('invasionInfoId ' + invasionInfoId);
        console.log('farmedChapters ', JSON.stringify(farmedChapters));

        //Получить id главы
        let chapters = Object.values(lib.data.invasion.chapter).filter((e) => e.invasionId === invasionInfoId);
        let chapterId = getChapterId(chapters, 'hero');
        console.log('chapterId ' + chapterId);

        //Питомцы, что необходимо купить
        let allPets = [6000, 6001, 6002, 6003, 6004, 6005, 6006, 6007, 6008, 6009];
        let pets = allPets;

        let titanIvent = false;
        for (let chapter of chapters) {
            if (chapter.settings?.unitType === 'titan') {
                titanIvent = true;
                break;
            }
        }

        for (let attempt = 1; attempt <= 15; attempt++) {
            //Получить героев, которых нужно собрать
            let heroIdsToBuy = await getHeroIdsToBuy();
            if (heroIdsToBuy.length == 0) {
                setProgress('', true);
                confShow(I18N('NT_HEROES_COLLECTED'));
                return;
            }
            console.log(heroIdsToBuy);
            setProgress(I18N('NT_COLLECT_HEROES_PROGRESS', { counter: heroIdsToBuy.length }), false);
            await new Promise((e) => setTimeout(e, 3000));

            //Питомцы, которых будем покупать:
            if (titanIvent == false){
                pets = [allPets[0], allPets[2], allPets[5], allPets[8]];
            }

            //Активировать главу
            let chapterInfo = await Caller.send({ name: 'invasion_setActiveChapter', args: { chapterId: chapterId } });

            //Id миссии
            let firstMissionId = chapterInfo.invasion.actions[0].payload.id;
            let missionId = firstMissionId;
            let lastMissionId = chapterInfo.invasion.actions[7].payload.id;
            let missionNumber = 1;

            //Жизни
            let lives = chapterInfo.invasion.lives;
            console.log('firstMissionId ' + firstMissionId);
            console.log('missionId ' + missionId);
            console.log('lives ' + lives);

            //Резервные герои, для добавления в покупки:
            //Лирия Измаил Галахад Себастьян
            let reserveHeroes = [67, 25, 2, 48];

            //Id героев, что необходимо собрать
            let heroIdsLength = 4;
            let heroIds = heroIdsToBuy.slice(0, heroIdsLength);
            if (heroIds.length < heroIdsLength) {
                heroIds.push(...reserveHeroes.slice(0, heroIdsLength - heroIds.length));
            }

            console.log(heroIds);
            while (lives > 0) {
                //Купить героев
                let result = await buyHeroesAndPets(missionNumber, lives, heroIds, pets);

                //Выйти, если босс побежден и полностью собрали три героя
                if (result && farmedChapters.includes(chapterId)) {
                    break;
                }

                //Текущая миссия босс или нет
                let boss = false;

                //Произвести атаку босса, если его ни разу не убили
                if (!farmedChapters.includes(chapterId)) {
                    if (missionId == lastMissionId) {
                        boss = true;
                        console.log('%cАтакуем босса ', 'color: green; font-weight: bold;');
                    }
                } else {
                    //Не атаковать босса, если его уже убили
                    if (missionId == lastMissionId) {
                        break;
                    }
                }

                //Получить атакующую команду
                let have = await getAttackingTeam();
                let heroes = have.heroes;
                let havePets = have.other;
                let pet;
                let petsFavor = {};
                if (havePets.length > 0) {
                    //Основной питомец 6005 - Альбрус
                    let mainPet = 6005;
                    if (havePets.includes(mainPet)) {
                        pet = mainPet;
                    } else {
                        pet = havePets[0];
                    }
                    //Покровительство
                    const petLib = lib.getData('pet');
                    for (let heroId of heroes) {
                        /** Поиск питомца для героя */
                        for (let petId of havePets) {
                            if (petLib[petId].favorHeroes.includes(heroId)) {
                                petsFavor[heroId] = petId;
                                havePets = havePets.filter((e) => e != petId);
                                break;
                            };
                        }
                    }
                }
                console.log('Атакующие герои ' + heroes);

                //Проходим миссию
                if (!boss) {
                    setProgress(I18N('NT_MISSION_PROGRESS', {missionNumber: missionNumber}), false);
                } else {
                    setProgress(I18N('NT_MISSION_PROGRESS_BOSS'), false);
                }
                await new Promise((e) => setTimeout(e, 2000));

                let error = await attackHeroMission(missionId, chapterId, heroes, pet, boss, petsFavor);
                if (error) {
                    await popup.confirm(I18N('NEW_CHARACTER_SOMETHING_WENT_WRONG'));
                    return;
                }
                //Убили / не убили босса, вышли с "while"
                if (boss == true) {
                    break;
                }
                //Купить талисман
                if (invasionInfo?.talismans?.length === 0) {
                    let talismanId = 0;
                    let missionRaid = true;
                    const talismanRerollsLeft = invasionInfo?.talismanRerollsLeft ?? 0;
                    console.log('talismanRerollsLeft: ' + talismanRerollsLeft);
                    const shouldResetChapter = await manageTalisman(talismanRerollsLeft, talismanId, missionRaid, chapterId);
                    //Сбрасываем главу если не купили талисман
                    if (shouldResetChapter){
                        setProgress(I18N('NHR_RESET_CHAPTER'), false);
                        await new Promise((e) => setTimeout(e, 1000));
                        invasionInfo = await resetChapter(chapterId);
                    }
                }
                //Результат атаки
                let invasionInfo = await Caller.send('invasion_getInfo');
                farmedChapters = invasionInfo.farmedChapters.map(Number);
                let missions = Object.values(invasionInfo.actions);
                let nextMissionIndex = missions.findIndex(e => e.payload.wins === 0);
                if (nextMissionIndex !== -1) {
                    missionId = missions[nextMissionIndex].payload.id;
                    missionNumber = nextMissionIndex + 1;
                    console.log('missionId ' + missionId);
                    console.log('missionNumber ' + missionNumber);
                }
                lives = invasionInfo.lives;
                console.log('lives ' + lives);
            }
        }
        await popup.confirm(I18N('NEW_CHARACTER_SOMETHING_WENT_WRONG'));
        return;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getHeroIdsToBuy() {
        const quest = await Caller.send('questGetAll');
        const heroIds = quest
            .filter((e) => e.state == 1 && lib.data.quest.special[e.id]?.translationMethod === 'invasionStallHeroFragments')
            .map((e) => lib.data.quest.special[e.id].farmCondition.eventFunc.args.fragmentId);
        return heroIds;
    }

    async function getTitanIdsToBuy() {
        const quest = await Caller.send('questGetAll');
        const titanIds = quest
            .filter((e) => e.state == 1 && lib.data.quest.special[e.id]?.translationMethod === 'invasionStallFragmentsTitans')
            .map((e) => lib.data.quest.special[e.id].farmCondition.eventFunc.args.fragmentId)
            .sort();
        return titanIds;
    }

    async function getTitanSkillIdsToBuy() {
        const quest = await Caller.send('questGetAll');
        const titanSkillIds = quest
            .filter((e) => e.state == 1 && lib.data.quest.special[e.id]?.translationMethod === 'invasionStallFragmentsTitanSkills')
            .map((e) => lib.data.quest.special[e.id].farmCondition.eventFunc.args.fragmentId);
        return titanSkillIds;
    }
    async function getRemainingRaids() {
        const quest = await Caller.send('questGetAll');
        const winsComplete = quest
            .filter((e) => e.state == 1 && lib.data.quest.special[e.id]?.translationMethod === 'invasionBossKill');
        if(winsComplete.length > 0){
            let requiredWins = Object.values(lib.data.quest.special).find(e => e.id == winsComplete[winsComplete.length - 1].id).farmCondition.amount
            let currentWins = winsComplete[winsComplete.length - 1].progress;
            let raidWins = 7;
            let remainingRaids = Math.ceil((requiredWins-currentWins)/raidWins);
            return remainingRaids;
        }
        return 0;
    }
    async function performRaidsIfNeeded(raidFunction) {
        let remainingRaids = await getRemainingRaids();
        if (remainingRaids <= 0) return;
        for (let i = 1; i <= remainingRaids; i++) {
            setProgress(I18N('NHR_CHAPTER_N1_RAID', { raidNumber: i, remainingRaids: remainingRaids }), false);
            await new Promise(resolve => setTimeout(resolve, 2000));
            await raidFunction();
        }
    }

    async function shouldSpendCoins() {
        const quest = await Caller.send('questGetAll');
        const resourceSpent = quest.filter((e) => e.state == 1
                                           && lib.data.quest.special[e.id]?.translationMethod === 'resourceSpentTypeId'
                                           && lib.data.quest.special[e.id]?.farmCondition.eventFunc.args.id === 1080);
        if(resourceSpent.length > 0){
            return true;
        }
        return false;
    }

    async function removeTutorialMessages() {
        let tasks = Object.values(lib.data.tutorial.task).filter((e) => e.params && e.params.includes('invasion') && e.saveState != null);
        let calls = [];
        for (let task of tasks){
            calls.push({name: 'tutorialSaveProgress', args: {taskId: task.id }});
        }
        tasks = Object.values(lib.data.tutorial.task).filter((e) => e.name && e.name.includes('invasion') && e.saveState != null);
        for (let task of tasks){
            calls.push({name: 'tutorialSaveProgress', args: {taskId: task.id }});
        }
        if (calls.length >= 1) {
            calls.sort((a, b) => a.args.taskId - b.args.taskId);
            try{
                await Caller.send(calls);
            } catch (e) {}
        }
    }

    function getHeroIdsMissingInShop() {
        let allHeroIds = Object.values(lib.data.hero).filter(e => e.type === 'hero' && !e.roleExtended.includes('boss')).map(e => e.id);
        let heroIdsInShop = lib.data.invasion.list[invasionInfoId].attackUnitsPool.availableUnits.filter(n => n < 1000);
        //console.log(allHeroIds);
        //console.log(heroIdsInShop);
        let missingIds = allHeroIds.filter(id => !heroIdsInShop.includes(id));
        return missingIds;
    }

    function getShopId(titanOrHero) {
        let shops = Object.values(lib.data.shop).filter(e => e.requirements?.invasion?.id === invasionInfoId);
        if (shops.length == 1){
            return shops[0].id;
        }
        let chapters = Object.values(lib.data.invasion.chapter).filter((e) => e.invasionId === invasionInfoId);
        if (chapters[0].settings?.stallShopId) {
            for (let chapter of chapters) {
                if (chapter.settings.unitType === titanOrHero) {
                    return chapter.settings.stallShopId;
                }
            }
        }
        return false;
    }

    async function chooseTalisman() {
        //Получить id талисмана
        let allTalismans = Object.values(lib.data.invasion.talismans);
        let buffs = Object.values(lib.data.adventure.buff);

        let savedTalismanId = getSaveVal('savedTalismanId', 0);
        let chekTalismans = [];

        chekTalismans.push({
            name: 0,
            label: I18N('NHR_ANY_OF_THE_TALISMANS'),
            title: I18N('NHR_ANY_OF_THE_TALISMANS_TITLE'),
            radio: 'talismans',
            checked: savedTalismanId == 0,
        });
        const excludedTalismans = [8005, 8009];
        for (let talisman of allTalismans) {
            //Исключаем талисман распродажи
            if (excludedTalismans.includes(Number(talisman.id))) continue;
            chekTalismans.push({
                name: talisman.id,
                label: cheats.translate(`LIB_TALISMAN_NAME_${talisman.id}`),
                title: cheats.translate(`${buffs.find(e => e.id === talisman.effectConfig.buffId).localeId}_DESC`),
                radio: 'talismans',
                checked: talisman.id == savedTalismanId,
            });
        }
        let cycle = true;
        while (cycle) {
            let answer = await popup.confirm(
                I18N('NHR_SELECT_TALISMAN'),
                [
                    { msg: I18N('NHR_NEXT'), result: true, color: 'green' },
                    { msg: I18N('BTN_CANCEL'), result: false, isCancel: true, color: 'red' },
                ],
                chekTalismans
            );
            if (!answer) {
                return 'cancel';
            }
            const taskList = popup.getCheckBoxes();
            for (let talisman of taskList) {
                if (talisman.checked) {
                    let talismanId = Number(talisman.name);
                    setSaveVal('savedTalismanId', talismanId);
                    cycle = false;
                    return talismanId;
                }
            }
        }
    }

    async function buyTalisman(talismanId = 0, missionRaid = false) {
        //Исключаем талисман Распродажи
        let talismans = (await Caller.send('invasion_rollTalismans')).talismanIds.filter(v => v !== 8009);
        console.log("talismanId " + talismanId);
        console.log("talismans " + talismans);
        if (talismans.length === 0) return false;
        if (missionRaid || talismanId == 0){
            //Исключаем талисман Капитала
            talismans = talismans.filter(v => v !== 8008);
            await Caller.send({name: "invasion_selectTalisman", args: {talismanId: talismans[0]}});
            if (!missionRaid){
                setProgress(I18N('NHR_BOUGHT_TALISMAN'), false);
                await new Promise((e) => setTimeout(e, 1000));
            }
            return true;
        }
        if (talismans.includes(talismanId)){
            await Caller.send({name: "invasion_selectTalisman", args: {talismanId: talismanId}});
            setProgress(I18N('NHR_BOUGHT_TALISMAN'), false);
            await new Promise((e) => setTimeout(e, 1000));
            return true;
        }
        setProgress(I18N('NHR_NO_TALISMAN'), false);
        await new Promise((e) => setTimeout(e, 1000));
        return false;
    }

    async function resetChapter(chapterId) {
        //Сбросить главу
        await Caller.send('invasion_resetChapter');
        //Активировать главу
        await Caller.send({ name: 'invasion_setActiveChapter', args: { chapterId: chapterId } });
        //Получить информацию
        return await Caller.send('invasion_getInfo');
    }

    function getChapterId(chapters, titanOrHero) {
        for (let chapter of chapters) {
            if (chapter.settings.unitType === titanOrHero) {
                return chapter.id;
            }
        }
        return false;
    }
    async function chooseTitanSpiritSkills() {
        //Получить id умений
        const elemental = Object.values(lib.data.titanSpirit.skills).filter(e => e.element !== 'primal').map(e => e.id);
        const primalIds = Object.values(lib.data.titanSpirit.skills).filter(e => e.element === 'primal').map(e => e.id);
        let savedTitanSpiritSkillsIds = getSaveVal('savedTitanSpiritSkillsIds', []);
        if (!Array.isArray(savedTitanSpiritSkillsIds)){
            savedTitanSpiritSkillsIds = [];
        }

        let chekTitanSpiritSkills = [];

        for (let skillId of elemental) {
            chekTitanSpiritSkills.push({
                name: skillId,
                label: `<span style="color: DeepSkyBlue;"> ${cheats.translate(`LIB_SKILL_${skillId}`)}</span>`,
                radio: 'elemental',
                checked: savedTitanSpiritSkillsIds.includes(skillId),
            });
        }
        for (let skillId of primalIds) {
            chekTitanSpiritSkills.push({
                name: skillId,
                label: `<span style="color: LimeGreen;"> ${cheats.translate(`LIB_SKILL_${skillId}`)}</span>`,
                radio: 'primalIds',
                checked: savedTitanSpiritSkillsIds.includes(skillId),
            });
        }
        let cycle = true;
        while (cycle) {
            let answer = await popup.confirm(
                I18N('NHR_SELECT_TITAN_SPIRIT_SKILLS'),
                [
                    { msg: I18N('NHR_NEXT'), result: true, color: 'green' },
                    { msg: I18N('BTN_CANCEL'), result: false, isCancel: true, color: 'red' },
                ],
                chekTitanSpiritSkills
            );
            if (!answer) {
                return 'cancel';
            }
            const taskList = popup.getCheckBoxes();
            console.log(taskList);
            let skillIds = [];
            for (let skill of taskList) {
                if (skill.checked) {
                    skillIds.push(Number(skill.name));
                }
            }

            if (skillIds.length > 0){
                savedTitanSpiritSkillsIds = [...skillIds];
                setSaveVal('savedTitanSpiritSkillsIds', savedTitanSpiritSkillsIds);
                cycle = false;
                return skillIds;
            }
        }
    }

    function compareVersions(version1, version2) {
        const v1 = version1.split('.').map(Number);
        const v2 = version2.split('.').map(Number);

        const maxLength = Math.max(v1.length, v2.length);

        for (let i = 0; i < maxLength; i++) {
            const num1 = v1[i] || 0;
            const num2 = v2[i] || 0;

            if (num1 > num2) return 1;
            if (num1 < num2) return -1;
        }

        return 0;
    }

    async function getAllHeroIDs() {
        let missingHeroes = getHeroIdsMissingInShop();
        let nameMissingHeroes = missingHeroes.map(id => cheats.translate(`LIB_HERO_NAME_${id}`)).join(', ');
        console.log(nameMissingHeroes);
        let heroIds = Object.values(lib.data.hero).filter(e => e.type === 'hero' && !e.roleExtended.includes('boss'));
        await popup.customPopup(async (complete) => {
            popup.custom.insertAdjacentHTML(
                'beforeend',
                '<div class="PopUp_text" style="text-align: left;">' +
                heroIds
                .map(e => ({ id: e.id, name: cheats.translate(`LIB_HERO_NAME_${e.id}`) }))
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(e => `<div>${e.name} - ${e.id}</div>`)
                .join('') +
                '</div>'
            );
            popup.setMsgText(I18N('NHR_GET_HERO_IDS_MESSAGE', {nameMissingHeroes}));
            popup.addButton({ isClose: true }, () => {
                complete(false);
                popup.hide();
            });
            popup.show();
        });
        //Возврат в меню "Новый персонаж"
        returnToNewCharacterMenu();
    }

    async function getAllTitanIDs() {
        let waterTitans = Object.values(lib.data.hero).filter(e => e.type === 'titan' && e.id < 4010);
        let fireTitans = Object.values(lib.data.hero).filter(e => e.type === 'titan' && e.id >= 4010 && e.id < 4020);
        let earthTitans = Object.values(lib.data.hero).filter(e => e.type === 'titan' && e.id >= 4020 && e.id < 4030);
        let darknessTitans = Object.values(lib.data.hero).filter(e => e.type === 'titan' && e.id >= 4030 && e.id < 4040);
        let lightTitans = Object.values(lib.data.hero).filter(e => e.type === 'titan' && e.id >= 4040 && e.id < 4050);
        let distortionTitans = Object.values(lib.data.hero).filter(e => e.type === 'titan' && e.id >= 4050 && e.id < 4060);
        let message = '';
        const heroIdsConsole = Object.values(lib.data.hero).filter(e => e.type === 'titan').map(e => `${e.id} - ` + cheats.translate(`LIB_HERO_NAME_${e.id}`)).join('\n');
        console.log(heroIdsConsole);

        message += `<br><div class="PopUp_text" style="color: DeepSkyBlue; text-align: center;">${I18N('NT_WATER_TITANS')}</div>` + waterTitans.map((e) => `<div class="PopUp_text" style="text-align: left;">${e.id} - ` + cheats.translate(`LIB_HERO_NAME_${e.id}`) + '</div>').join('') + '<br>';
        message += `<div class="PopUp_text" style="color: red; text-align: center;">${I18N('NT_FIRE_TITANS')}</div>` + fireTitans.map((e) => `<div class="PopUp_text" style="text-align: left;">${e.id} - ` + cheats.translate(`LIB_HERO_NAME_${e.id}`) + '</div>').join('') + '<br>';
        message += `<div class="PopUp_text" style="color: Lime; text-align: center;">${I18N('NT_EARTH_TITANS')}</div>` + earthTitans.map((e) => `<div class="PopUp_text" style="text-align: left;">${e.id} - ` + cheats.translate(`LIB_HERO_NAME_${e.id}`) + '</div>').join('') + '<br>';
        message += `<div class="PopUp_text" style="color: SlateGray; text-align: center;">${I18N('NT_DARK_TITANS')}</div>` + darknessTitans.map((e) => `<div class="PopUp_text" style="text-align: left;">${e.id} - ` + cheats.translate(`LIB_HERO_NAME_${e.id}`) + '</div>').join('') + '<br>';
        message += `<div class="PopUp_text" style="color: Yellow; text-align: center;">${I18N('NT_LIGHT_TITANS')}</div>` + lightTitans.map((e) => `<div class="PopUp_text" style="text-align: left;">${e.id} - ` + cheats.translate(`LIB_HERO_NAME_${e.id}`) + '</div>').join('') + '<br>';
        message += `<div class="PopUp_text" style="color: Magenta; text-align: center;">${I18N('NT_DISTORTION_TITANS')}</div>` + distortionTitans.map((e) => `<div class="PopUp_text" style="text-align: left;">${e.id} - ` + cheats.translate(`LIB_HERO_NAME_${e.id}`) + '</div>').join('');

        await popup.customPopup(async (complete) => {
            popup.custom.insertAdjacentHTML(
                'beforeend',
                message
            );
            popup.setMsgText(I18N('NT_GET_TITAN_IDS_MESSAGE'));
            popup.addButton({ isClose: true }, () => {
                complete(false);
                popup.hide();
            });
            popup.show();
        });
        //Возврат в меню "Новый титан"
        returnToNewTitanMenu();
    }

    async function getAttackingTeam () {
        let result = await Caller.send('invasion_getInfo')
        .then(e => Object.fromEntries(
            Object.entries(e.fragments).filter(([_, v]) => v !== 0)
        ));

        let haveFragments = Object.entries(result).map(e => ({id:e[0],count:e[1]})).sort((a, b) => b.count - a.count);
        let allWeHave = {heroes: [], other: [], allHeroes: [], allAvailableFragments: result}
        for (let m of haveFragments) {
            if(m.count == 0){
                continue;
            }
            //Отделяем питомцев и фрагменты тотемов
            if (Number(m.id) < 4400) {
                allWeHave.allHeroes.push(Number(m.id));
                if (allWeHave.heroes.length < 5) {
                    allWeHave.heroes.push(Number(m.id));
                }
            }
            if (Number(m.id) > 4400) {
                allWeHave.other.push(Number(m.id));
            }
        }
        return allWeHave;
    }

    async function getTeamButton (attackingTeams, chapterNumber, archdemon = false) {
        const unitType = getUnitType(attackingTeams[0]);
        console.log("unitType " + unitType);
        console.log('attackingTeams ', JSON.stringify(attackingTeams));

        const saveKeys = {
            hero: 'savedCommandForHeroesChapter',
            titan: 'savedCommandForTitansChapter',
            archdemon: 'savedCommandForArchdemon'
        };
        const key = archdemon ? 'archdemon' : unitType;
        const savedCommandForChapter = getSaveVal(saveKeys[key], '');

        //let savedCommandForChapter = unitType === 'hero' ? getSaveVal('savedCommandForHeroesChapter', '') : getSaveVal('savedCommandForTitansChapter', '');

        let savedCommand = [];
        let teamExists = false;
        if (savedCommandForChapter.length > 1) {
            savedCommand = savedCommandForChapter.split(',').map(Number);
            if (savedCommand.length != 5) {
                savedCommand = savedCommandForChapter.split('-').map(Number);
            }
            teamExists = attackingTeams.some(arr => arr.every((val, i) => val === savedCommand[i]));
        }

        let nameMissingHeroes = unitType === 'hero' ? getHeroIdsMissingInShop().map(id => cheats.translate(`LIB_HERO_NAME_${id}`)).join(', ') : '';
        let cycle = true;
        while (cycle) {
            let buttons = [];
            buttons.push(
                {
                    msg: `<span style="font-size: 16px;">${I18N(unitType === 'hero' ? 'NHR_TEAM_HERO_N0' : 'NT_TEAM_TITAN_N0' )}</span>`,
                    placeholder: '1,2,3,4,5',
                    isInput: true,
                    color: 'green',
                },
            );
            if (savedCommandForChapter.length > 1 && !teamExists) {
                buttons.push(
                    {
                        msg: I18N('NHR_TEAM_HERO_MY_DARLING'),
                        isInput: true,
                        default: savedCommandForChapter,
                        color: 'green',
                    },
                );
            }
            for (let team of attackingTeams){
                let msg = unitType === 'hero' ? `<span style="font-size: 16px;">${team.map(e => cheats.translate(`LIB_HERO_NAME_${e}`)).join(', ')}</span>`
                :team.map((e, index) => {
                    let color = e >= 4050 ? 'Fuchsia'
                              : e >= 4040 ? 'Yellow'
                              : e >= 4030 ? '#1A1A1A'
                              : e >= 4020 ? 'DarkGreen'
                              : e >= 4010 ? 'red'
                              : e >= 4000 ? 'MediumBlue'
                              : '#FFFFFF';
                    let comma = index !== team.length - 1 ? ', ' : '';
                    return `<span style="color: ${color}; text-shadow: none; font-size: 18px;">${cheats.translate(`LIB_HERO_NAME_${e}`)}${comma}</span>`;
                }).join('');

                buttons.push(
                    {
                        msg: msg,
                        isInput: true,
                        default: team,
                        color: 'green',
                    },
                );

            }
            buttons.push(
                {
                    msg: I18N('NT_COMPLETE_CHAPTER_CANCEL'),
                    result: false,
                    isCancel: true,
                    color: 'red',
                },
            );
            let message = I18N(unitType === 'hero' ? 'NT_ENTER_HERO_IDS' : 'NT_ENTER_TITAN_IDS', { chapterNumber: romanNumerals[chapterNumber], nameMissingHeroes });
            let answer = await popup.confirm(message, buttons);

            if (!answer) {
                return 'cancel';
            }

            let result = answer.split(',');
            if (result.length != 5) {
                result = answer.split('-');
            }
            let team = [...new Set(result)];

            if (team.length != 5) {
                await popup.confirm(I18N('NHR_INCORRECT_TEAM'));
                continue;
            }
            let wrongTeam = false;
            for (let p in team) {
                team[p] = +team[p].trim()
                if (Number.isNaN(team[p])) {
                    await popup.confirm(I18N('NHR_INCORRECT_TEAM'));
                    wrongTeam = true;
                    break;
                }
            }
            if (wrongTeam) {
                continue;
            }
            if (unitType === 'hero' ) {
                let heroIdsInShop = lib.data.invasion.list[invasionInfoId].attackUnitsPool.availableUnits.filter(n => n < 1000);
                let isIncluded = team.every(id => heroIdsInShop.includes(id));
                if(!isIncluded) {
                    await popup.confirm(I18N('NHR_INCORRECT_TEAM_HEROES_ARE_UNAVAILABLE'));
                    continue;
                }
                let teamExists = false;
                let teamIndex = null;
                teamExists = attackingTeams.some(arr => arr.every((val, i) => val === team[i]));
                if (teamExists) {
                    teamIndex = attackingTeams.findIndex(arr => arr.every((val, i) => val === team[i]));
                }
                setSaveVal(saveKeys[key], answer)
                //setSaveVal('savedCommandForHeroesChapter', answer);
                return {team:team, teamIndex: teamIndex}
            }

            if (unitType === 'titan' ) {
                let titanIds = Object.values(lib.data.hero).filter(e => e.type === 'titan').map(e => e.id);
                let isIncluded = team.every(titan => titanIds.includes(titan));
                if(!isIncluded) {
                    await popup.confirm(I18N('NHR_INCORRECT_TEAM_HEROES_ARE_UNAVAILABLE'));
                    continue;
                }
                setSaveVal('savedCommandForTitansChapter', answer);
                return team;
            }
        }
    }

    async function spendValorCoins() {
        let answer = await popup.confirm(
            I18N('NHR_SPEND_VALOR_COINS_MESSAGE'),
            [
                { msg: I18N('NHR_APPLY'), result: true, color: 'green' },
                { msg: I18N('NHR_NOT_APPLY'), result: false, isCancel: true, color: 'red' },
            ],
        );
        if (!answer) {
            //Возврат в меню "Новый персонаж"
            returnToNewCharacterMenu();
            return;
        }

        let [invasionInfo, inventoryGet, workshopBuffInfo] = await Caller.send(['invasion_getInfo', 'inventoryGet', 'workshop_getInfo']);
        let chapters = Object.values(lib.data.invasion.chapter).filter((e) => e.invasionId === invasionInfoId);
        const abyssSealId = Object.values(lib.data.invasion.list).find((e) => e.id == invasionInfoId)?.settings?.abyssSealCoinId ?? 0;
        let coins = chapters[0].completeReward.coin;
        let valorCoinId = 0;
        let sapphireMedallionId = 0;
        for (let coin in coins) {
            if (coin == abyssSealId) continue;
            if(coins[coin] > 10) {
                valorCoinId = coin;
            }
            if(coins[coin] < 10) {
                sapphireMedallionId = coin;
            }
        }
        console.log('valorCoinId ' + valorCoinId);
        console.log('sapphireMedallionId ' + sapphireMedallionId);
        let valorCoins = inventoryGet.coin?.[valorCoinId] ?? 0;
        let grailId = Object.entries(lib.data.workshop.relic).find(([key, item]) => item.invasionId === invasionInfoId && item.effect?.type === "gachaReward_change")[0];
        let grailLvl = workshopBuffInfo.relics.find(e => e.id == grailId ).level;
        let exchangeValue = 2800 - grailLvl * 100;
        if (valorCoins < exchangeValue) {
            await popup.confirm(I18N('NHR_NOT_ENOUGH_COINS'));
            //Возврат в меню "Новый персонаж"
            returnToNewCharacterMenu();
            return;
        }

        let numberOfExchanges = Math.floor(valorCoins/exchangeValue);
        let offerId = lib.data.invasion.list[invasionInfoId].clientData.festival.lootBoxSpecialOfferId;
        let boxName = Object.keys((await Caller.send('specialOffer_getAll')).find(e => e.id == offerId).offerData.lootBoxes)[0];

        let sapphireMedallion = 0;
        let fragmentHero = 0;
        let fragmentTitan = 0;
        let counter = numberOfExchanges;
        let cycle = true;
        let exchangeCounter = 1;
        while (cycle) {
            let amount = 10;
            console.log(counter);
            if (counter == 0) {
                cycle = false;
                break;
            }
            if (counter < 10) {
                amount = counter;
            }
            console.log(amount);
            if (amount == 10) {
                setProgress(I18N('NHR_SPEND_VALOR_COINS_PROGRESS', { exchangeCounter: exchangeCounter, maximumCounter: Math.floor(numberOfExchanges/10) }), false);
                await new Promise((e) => setTimeout(e, 1000));
            } else {
                if (exchangeCounter > 1) {
                    setProgress(I18N('NHR_SPEND_VALOR_COINS_PROGRESS_2'), false);
                    await new Promise((e) => setTimeout(e, 2000));
                } else {
                    setProgress(I18N('NHR_SPEND_VALOR_COINS_PROGRESS_3'), false);
                    await new Promise((e) => setTimeout(e, 2000));
                }
            }
            let result = await Caller.send({ name: "lootBoxBuy", args:{ box:boxName, offerId:offerId, price:"openCoin", amount: amount}})
            if (result) {
                counter -= amount;
                exchangeCounter++;
                for (let r of result) {
                    if (r.coin?.[sapphireMedallionId]) {
                        sapphireMedallion += Number(r.coin[sapphireMedallionId]);
                    }
                    if (r.fragmentHero) {
                        fragmentHero += Number(Object.values(r.fragmentHero)[0]);
                    }
                    if (r.fragmentTitan) {
                        fragmentTitan += Number(Object.values(r.fragmentTitan)[0]);
                    }
                }
            } else {
                cycle = false;
                break;
            }
        }
        setProgress('');
        await popup.confirm(I18N('NHR_SPEND_VALOR_COINS_RESULT', {numberOfExchanges: numberOfExchanges, sapphireMedallion:sapphireMedallion, fragmentHero: fragmentHero > fragmentTitan ? fragmentHero : fragmentTitan }));
        cheats.refreshGame();
        //Возврат в меню "Новый персонаж"
        //returnToNewCharacterMenu();
    }

    async function buyTitansAndTotemSkils (missionNumber, lives, titanIds, totemSkilsIds) {
        let titanOrHero = 'titan';
        let shopPinSlot = false;
        let dots = 1;
        setProgress(I18N('NHR_SHOPPING') + `${'.'.repeat(dots)}`, false);
        dots = dots === 3 ? 1 : dots + 1;

        //Получить id магазина
        let shopId = getShopId(titanOrHero); //2023 Магазин
        console.log('Зашли в магазин');
        console.log('Id магазина ' + shopId);
        console.log('titanIds ', JSON.stringify(titanIds));
        console.log('totemSkilsIds ', JSON.stringify(totemSkilsIds));

        //Получить атакующую команду
        let haveFragments = await getAttackingTeam();
        let allTitans = haveFragments.allHeroes;
        let allSkils = haveFragments.other;
        let allAvailableFragments = haveFragments.allAvailableFragments;

        //Фрагменты титанов
        let titanFragments = new Array(titanIds.length).fill(0);
        for (let i = 0; i < titanFragments.length; i++) {
            if (allAvailableFragments[titanIds[i]]) {
                titanFragments[i] = allAvailableFragments[titanIds[i]];
            }
        }
        //Фрагменты тотемов
        let totemSkilFragments = new Array(totemSkilsIds.length).fill(0);
        for (let i = 0; i < totemSkilFragments.length; i++) {
            if (allAvailableFragments[totemSkilsIds[i]]) {
                totemSkilFragments[i] = allAvailableFragments[totemSkilsIds[i]];
            }
        }

        //Продать титанов
        if (missionNumber >= 2 || lives < 2) {
            await sellHeroes (titanIds, titanFragments, allTitans, allAvailableFragments);
        }
        //Продать тотемы
        /*if (missionNumber >= 5) {
            await sellHeroes (totemSkilsIds, totemSkilFragments, allSkils, allAvailableFragments);
        }*/

        console.log('titanFragments ', JSON.stringify(titanFragments));
        console.log('totemSkilFragments ', JSON.stringify(totemSkilFragments));
//await new Promise((e) => setTimeout(e, 2000000));

        let coins = {value: await Caller.send('inventoryGet').then((e) => e.coin[1080])};
        console.log('Монеты: ' + coins.value);

        let shopSlots = null;
        let boughtAllTitans = areAllFragmentsBought (titanFragments);
        let boughtAllTomemSkilFragments = areAllFragmentsBought (totemSkilFragments);
        console.log('boughtAllTitans: ' + boughtAllTitans);
        console.log('boughtAllTomemSkilFragments: ' + boughtAllTomemSkilFragments);
        let purchaseNumber = 0;
        while (coins.value >= 12) {
            setProgress(I18N('NHR_SHOPPING') + `${'.'.repeat(dots)}`, false);
            dots = dots === 3 ? 1 : dots + 1;
            purchaseNumber++;
            console.log('%cЗакупки ' + purchaseNumber, 'color: green; font-weight: bold;');
            //Получить состояние магазина
            if (!shopSlots) {
                shopSlots = await Caller.send({ name: 'shopGet', args: { shopId: shopId } }).then((e) => Object.values(e.slots));
            }
            //Если куплены все что необходимо, выйти и заменить
            if (boughtAllTitans && boughtAllTomemSkilFragments) {
                return true;
            }

            //Купить титанов
            if (!boughtAllTitans) {
                shopPinSlot = await buyTitans (shopId, coins, titanIds, shopSlots, titanFragments);
                //Куплены все герои или нет
                boughtAllTitans = areAllFragmentsBought (titanFragments)
            }

            //Купить навыки тотемов
            if (!boughtAllTomemSkilFragments) {
                shopPinSlot = await buyTomemSkilFragments (shopId, coins, totemSkilsIds, shopSlots, totemSkilFragments);
                //Куплены все навыки тотемов или нет
                boughtAllTomemSkilFragments = areAllFragmentsBought (totemSkilFragments)
            }

            if (missionNumber == 1) {
                console.log('%cЗашли закупиться для 1 миссии ', 'color: green; font-weight: bold;');
                await buyRandomHeroes (shopId, coins, titanOrHero)
                return false;
            }

            console.log("shopPinSlot " + shopPinSlot);

            //Обновить магазин
            if (coins.value >= 15 && !shopPinSlot) {
                shopSlots = await shopRefresh (shopId, coins);
            } else {
                break;
            }
        }
        return false;
    }

    function areAllFragmentsBought (fragments) {
        let missingFragments = fragments.some(item => item < 7);
        return !missingFragments;
    }

    async function buyTitans (shopId, coins, titanIds, shopSlots, titanFragments) {
        let shopPinSlot = false;
        console.log("Зашли в закупку титанов ");
        try {
            for (let slot of shopSlots) {
                //Пропустить скрытые лоты и навыки тотемов
                if (slot.reward.invasionFragmentTitanRand || slot.reward.invasionFragmentSkillRand || slot.reward.invasionFragmentSkill || slot.bought) {
                    continue;
                }

                if (slot.pinned){
                    let unpinSlot = false;
                    let mas = Object.keys(slot.reward.invasionFragmentTitan);
                    for (let id of mas){
                        let numberOfFragments = titanFragments[titanIds.indexOf(id)];
                        if(numberOfFragments > 6){
                            unpinSlot = true;
                            continue;
                        }
                        unpinSlot = false;
                        break;
                    }
                    if(unpinSlot == true){
                        await Caller.send({ name: 'shop_unpinSlot', args: { shopId: shopId, slotId: slot.id } });
                    }
                }

                //Купить титанов
                for (let t = 0; t < titanIds.length; t++) {
                    if (slot.reward.invasionFragmentTitan?.[titanIds[t]] && titanFragments[t] < 7) {
                        if (coins.value >= slot.cost.coin[1080]) {
                            let shopBuy = await Caller.send({ name: 'shopBuy', args: { shopId: shopId, slot: slot.id } });
                            console.log('%cКуплен титан ', 'color: green; font-weight: bold;');
                            coins.value -= slot.cost.coin[1080];
                            titanFragments[t] += slot.reward.invasionFragmentTitan?.[titanIds[t]];

                            //Если c первым титаном есть другой
                            for (let i = t+1; i < titanIds.length; i++) {
                                if (slot.reward.invasionFragmentTitan?.[titanIds[i]]) {
                                    console.log('%cВторой титан в комплекте ', 'color: green; font-weight: bold;');
                                    titanFragments[i] += slot.reward.invasionFragmentTitan?.[titanIds[i]];
                                    break;
                                }
                            }
                        } else {
                            await Caller.send({ name: 'shop_pinSlot', args: { shopId: shopId, slotId: slot.id } });
                            shopPinSlot = true;
                        }
                        break;
                    }
                }
            }
        } catch (e) {
            console.log('%cПроизошла ошибка при покупке титана', 'color: red; font-weight: bold;');
            console.error(e);
        }
        console.log("Вышли с закупки титанов. Закрепили слот: " + shopPinSlot);
        return shopPinSlot;
    }

    async function buyTomemSkilFragments (shopId, coins, totemSkilsIds, shopSlots, totemSkilFragments) {
        let shopPinSlot = false;
        console.log("Зашли в закупку фрагментов тотемов ");
        try {
            for (let slot of shopSlots) {
                //Пропустить скрытые лоты титанов
                if (slot.reward.invasionFragmentTitanRand || slot.reward.invasionFragmentTitan || slot.bought) {
                    continue;
                }

                if (slot.pinned && !slot.reward.invasionFragmentSkillRand){
                    let unpinSlot = false;
                    let mas = Object.keys(slot.reward.invasionFragmentSkill);
                    for (let id of mas){
                        let numberOfFragments = totemSkilFragments[totemSkilsIds.indexOf(id)];
                        if(numberOfFragments > 6){
                            unpinSlot = true;
                            continue;
                        }
                        unpinSlot = false;
                        break;
                    }
                    if(unpinSlot == true){
                        await Caller.send({ name: 'shop_unpinSlot', args: { shopId: shopId, slotId: slot.id } });
                    }
                }
                //Купить случайные навыки тотема
                if (slot.reward.invasionFragmentSkillRand) {
                    if (coins.value >= slot.cost.coin[1080]) {
                        let shopBuy = await Caller.send({ name: 'shopBuy', args: { shopId: shopId, slot: slot.id } });
                        console.log('%cКуплена часть навыка тотема ', 'color: green; font-weight: bold;');
                        let fragments = Object.keys(shopBuy.invasionFragmentSkill).map(Number);
                        coins.value -= slot.cost.coin[1080];
                        for (let fragmentId of fragments) {
                            let index = totemSkilsIds.indexOf(fragmentId);
                            if (index !== -1) {
                                totemSkilFragments[index] += 1;
                            } else {
                                await Caller.send({name: "invasion_fragmentSell", args: {fragmentId: fragmentId, amount: 1}});
                                coins.value += 6;
                            }
                        }
                    } else {
                        await Caller.send({ name: 'shop_pinSlot', args: { shopId: shopId, slotId: slot.id } });
                        shopPinSlot = true;
                    }
                    continue;
                }

                //Купить навыки тотема
                for (let s = 0; s < totemSkilsIds.length; s++) {
                    if (slot.reward.invasionFragmentSkill?.[totemSkilsIds[s]] && totemSkilFragments[s] < 7) {
                        if (coins.value >= slot.cost.coin[1080]) {
                            let shopBuy = await Caller.send({ name: 'shopBuy', args: { shopId: shopId, slot: slot.id } });
                            console.log('%cКуплена часть навыка тотема ', 'color: green; font-weight: bold;');
                            coins.value -= slot.cost.coin[1080];
                            totemSkilFragments[s] += slot.reward.invasionFragmentSkill?.[totemSkilsIds[s]];
                        } else {
                            await Caller.send({ name: 'shop_pinSlot', args: { shopId: shopId, slotId: slot.id } });
                            shopPinSlot = true;
                        }
                        break;
                    }
                }
            }
        } catch (e) {
            console.log('%cПроизошла ошибка при покупке навыка тотема', 'color: red; font-weight: bold;');
            console.error(e);
        }
        console.log("Вышли с закупки навыков тотема. Закрепили слот: " + shopPinSlot);
        return shopPinSlot;
    }

    async function buyHeroesAndPets (missionNumber, lives, heroIds, pets) {
        let titanOrHero = 'hero';
        let shopPinSlot = false;
        const canSellItems = missionNumber >= 4 || lives < 2;
        let dots = 1;
        setProgress(I18N('NHR_SHOPPING') + `${'.'.repeat(dots)}`, false);
        dots = dots === 3 ? 1 : dots + 1;

        //Получить id магазина
        let shopId = getShopId(titanOrHero); //2020 Магазин
        console.log('Зашли в магазин');
        console.log('Id магазина ' + shopId);
        console.log('heroIds ', JSON.stringify(heroIds));
        console.log('pets ', JSON.stringify(pets));

        //Получить атакующую команду
        let haveFragments = await getAttackingTeam();
        let allHeroes = haveFragments.allHeroes;
        let allAvailableFragments = haveFragments.allAvailableFragments;

        //Фрагменты героев
        let heroFragments = new Array(heroIds.length).fill(0);
        for (let i = 0; i < heroFragments.length; i++) {
            if (allAvailableFragments[heroIds[i]]) {
                heroFragments[i] = allAvailableFragments[heroIds[i]];
            }
        }

        let heroesProgress = {};
        heroIds.forEach(id => {
            heroesProgress[id] = allAvailableFragments[id] || 0;
        });
        console.log('heroesProgress ', JSON.stringify(heroesProgress));

        //Продать героев
        if (canSellItems) {
            //Продать героев
            await sellHeroes (heroIds, heroFragments, allHeroes, allAvailableFragments);
        }

        console.log('heroFragments ', JSON.stringify(heroFragments));
//await new Promise((e) => setTimeout(e, 2000000));

        let coins = {value: await Caller.send('inventoryGet').then((e) => e.coin[1080])};
        console.log('Монеты: ' + coins.value);

        let shopSlots = null;
        let boughtAllHeroes = areAllFragmentsBought (heroFragments);
        let purchaseNumber = 0;
        while (coins.value >= 12) {
            setProgress(I18N('NHR_SHOPPING') + `${'.'.repeat(dots)}`, false);
            dots = dots === 3 ? 1 : dots + 1;
            purchaseNumber++;
            console.log('%cЗакупки ' + purchaseNumber, 'color: green; font-weight: bold;');
            //Получить состояние магазина
            if (!shopSlots) {
                shopSlots = await Caller.send({ name: 'shopGet', args: { shopId: shopId } }).then((e) => Object.values(e.slots));
            }

            //Если куплены все герои, питомци определить нужно ли тратить монеты
            if (boughtAllHeroes && pets.length == 0) {
                let spendCoins = await shouldSpendCoins();
                console.log('shouldSpendCoins ' + spendCoins);
                //Если нет задания на трату монет, выйти и заменить героев для покупки
                if (!spendCoins ) {
                    return true;
                }
                console.log('%cВыполняем задание на трату монет', 'color: red; font-weight: bold;');
                while (coins.value >= 12) {
                    for (let slot of shopSlots) {
                        if (coins.value >= slot.cost.coin[1080] && slot.bought == false) {
                            await Caller.send({ name: 'shopBuy', args: { shopId: shopId, slot: slot.id } });
                            coins.value -= slot.cost.coin[1080];
                        }
                    }
                    if (coins.value >= 3){
                        shopSlots = await shopRefresh (shopId, coins);
                    }
                }
            }
            //Купить героев
            if (!boughtAllHeroes) {
                shopPinSlot = await buyHeroes (shopId, coins, heroIds, shopSlots, heroFragments);
                //shopPinSlot = await buyItems (shopId, coins, shopSlots, heroesProgress, canSellItems);
                //Куплены все герои
                boughtAllHeroes = areAllFragmentsBought (heroFragments);
                //boughtAllHeroes = Object.values(heroesProgress).every(fragments => fragments >= 7);
            }

            if (missionNumber == 1) {
                console.log('%cЗашли закупиться героями для 1 миссии ', 'color: green; font-weight: bold;');
                await buyRandomHeroes (shopId, coins, titanOrHero);
                return;
            }

            if (missionNumber > 1 && missionNumber < 4 && lives >=2 && purchaseNumber >= 2){
                console.log('%cЗашли, чтобы пораньше выйти с закупок ', 'color: green; font-weight: bold;');
                return false;
            }

            //Купить питомцев
            if (pets.length > 0) {
                await buyPets (shopId, coins, pets, shopSlots, boughtAllHeroes);
            }
            console.log("+++++ shopPinSlot " + shopPinSlot);
            //Обновить магазин
            if (coins.value >= 15 && !shopPinSlot) {
                shopSlots = await shopRefresh (shopId, coins);
            } else {
                break;
            }
        }
        return false;
    }

    async function buyHeroesAndPets_2 (missionNumber, lives, heroIds, pets) {
        //let heroIds = [13,17,60,68,72]
        let titanOrHero = 'hero';
        let shopPinSlot = false;
        const canSellItems = missionNumber >= 4 || lives < 2;
        let dots = 1;
        setProgress(I18N('NHR_SHOPPING') + `${'.'.repeat(dots)}`, false);
        dots = dots === 3 ? 1 : dots + 1;

        //Получить id магазина
        let shopId = getShopId(titanOrHero); //2020 Магазин
        console.log('Зашли в магазин. Id магазина: ' + shopId);
        console.log('heroIds ', JSON.stringify(heroIds));
        console.log('pets ', JSON.stringify(pets));

        //Имеющиеся фрагменты
        let allAvailableFragments = (await Caller.send('invasion_getInfo')).fragments

        //Фрагменты героев
        let heroesProgress = {};
        heroIds.forEach(id => {
            heroesProgress[id] = allAvailableFragments[id] || 0;
        });
        console.log('heroesProgress ', JSON.stringify(heroesProgress));
        //heroesProgress  {"13":0,"17":5,"60":0,"68":6,"72":7}

        //Продать героев
        if (canSellItems) {
            //Продать героев
            await sellHeroes_2 (heroIds, allAvailableFragments);
        }

        console.log('heroFragments ', JSON.stringify(heroFragments));
//await new Promise((e) => setTimeout(e, 2000000));

        let coins = {value: await Caller.send('inventoryGet').then((e) => e.coin[1080])};
        console.log('Монеты: ' + coins.value);

        let shopSlots = null;
        let boughtAllHeroes = areAllFragmentsBought (heroFragments);
        let purchaseNumber = 0;
        while (coins.value >= 12) {
            setProgress(I18N('NHR_SHOPPING') + `${'.'.repeat(dots)}`, false);
            dots = dots === 3 ? 1 : dots + 1;
            purchaseNumber++;
            console.log('%cЗакупки ' + purchaseNumber, 'color: green; font-weight: bold;');
            //Получить состояние магазина
            if (!shopSlots) {
                shopSlots = await Caller.send({ name: 'shopGet', args: { shopId: shopId } }).then((e) => Object.values(e.slots));
            }

            //Если куплены все герои, питомци определить нужно ли тратить монеты
            if (boughtAllHeroes && pets.length == 0) {
                let spendCoins = await shouldSpendCoins();
                console.log('shouldSpendCoins ' + spendCoins);
                //Если нет задания на трату монет, выйти и заменить героев для покупки
                if (!spendCoins ) {
                    return true;
                }
                console.log('%cВыполняем задание на трату монет', 'color: red; font-weight: bold;');
                while (coins.value >= 12) {
                    for (let slot of shopSlots) {
                        if (coins.value >= slot.cost.coin[1080] && slot.bought == false) {
                            await Caller.send({ name: 'shopBuy', args: { shopId: shopId, slot: slot.id } });
                            coins.value -= slot.cost.coin[1080];
                        }
                    }
                    if (coins.value >= 3){
                        shopSlots = await shopRefresh (shopId, coins);
                    }
                }
            }
            //Купить героев
            if (!boughtAllHeroes) {
                shopPinSlot = await buyHeroes (shopId, coins, heroIds, shopSlots, heroFragments);
                //shopPinSlot = await buyItems (shopId, coins, shopSlots, heroesProgress, canSellItems);
                //Куплены все герои
                boughtAllHeroes = areAllFragmentsBought (heroFragments);
                //boughtAllHeroes = Object.values(heroesProgress).every(fragments => fragments >= 7);
            }

            if (missionNumber == 1) {
                console.log('%cЗашли закупиться героями для 1 миссии ', 'color: green; font-weight: bold;');
                await buyRandomHeroes (shopId, coins, titanOrHero);
                return;
            }

            if (missionNumber > 1 && missionNumber < 4 && lives >=2 && purchaseNumber >= 2){
                console.log('%cЗашли, чтобы пораньше выйти с закупок ', 'color: green; font-weight: bold;');
                return false;
            }

            //Купить питомцев
            if (pets.length > 0) {
                await buyPets (shopId, coins, pets, shopSlots, boughtAllHeroes);
            }
            console.log("+++++ shopPinSlot " + shopPinSlot);
            //Обновить магазин
            if (coins.value >= 15 && !shopPinSlot) {
                shopSlots = await shopRefresh (shopId, coins);
            } else {
                break;
            }
        }
        return false;
    }

    async function sellHeroes_2 (heroIds, allAvailableFragments) {

        /*console.log("Id нужных героев > 7---------------");
        for (let i = 0; i < heroIds.length; i++) {
            if (heroFragments[i] > 7){
                console.log("Id " + heroIds[i] + " продали " + (heroFragments[i]-7));
                await Caller.send({name: "invasion_fragmentSell", args: {fragmentId: heroIds[i], amount: heroFragments[i]-7}});
            }
        }

        let maximumNumberOfHeroes = 5;
        if (heroIds[0] >= 4500 ) {
            maximumNumberOfHeroes = heroIds.length;
        }
        console.log("Id ненужных героев -------------");
        if (allHeroes.length > maximumNumberOfHeroes) {
            let counter = 0;
            for (let i = allHeroes.length - 1; i >= 0; i--) {
                if ((allHeroes.length - counter) == maximumNumberOfHeroes){
                    break;
                }
                if (heroIds.includes(allHeroes[i])){
                    continue;
                }
                console.log("Продали ненужного " + allHeroes[i]);
                await Caller.send({name: "invasion_fragmentSell", args: {fragmentId: allHeroes[i], amount: allAvailableFragments[allHeroes[i]]}});
                counter++;
            }
        }*/
    }

    async function shopRefresh (shopId, coins) {
        try {
            let shopSlots = await Caller.send([{ name: 'shopRefresh', args: { shopId: shopId } }]).then((e) => Object.values(e.slots));
            coins.value -= 3;
            console.log('Обновили магазин. Осталось монет: ' + coins.value);
            return shopSlots;
        } catch (e) {
            console.error(e);
            coins.value = await Caller.send('inventoryGet').then((e) => e.coin[1080]);
            return null;
        }
    }
    async function buyRandomHeroes (shopId, coins, titanOrHero) {
        titanOrHero = titanOrHero.toLowerCase();
        const isHero = titanOrHero === 'hero';
        const discountedLotPrice = isHero ? 16 : 12;
        const randomRewardPrice = isHero ? 18 : 14;
        try {
            let shopSlots = await Caller.send({ name: 'shopGet', args: { shopId: shopId } }).then((e) => Object.values(e.slots));
            let haveFragments = await getAttackingTeam();
            let allHeroes = haveFragments.allHeroes;
            let numberOfHeroes = allHeroes.length;
            console.log('allHeroes ', JSON.stringify(allHeroes));
            while (coins.value >= discountedLotPrice || numberOfHeroes < 5) {
                //Купить лот с 1 героем со скидкой
                /*for (let slot of shopSlots) {
                    if (slot.cost.coin[1080] == 8 && slot.bought == false){
                        if (coins.value >= slot.cost.coin[1080]) {
                            await Caller.send({ name: 'shopBuy', args: { shopId: shopId, slot: slot.id } });
                            coins.value -= slot.cost.coin[1080];
                            if (!numberOfHeroes.includes(Number(Object.keys(slot.reward.invasionFragmentHero)[0]))){
                                numberOfHeroes++;
                                allHeroes.push(Number(Object.keys(slot.reward.invasionFragmentHero)[0]));
                            }
                        } else {
                            return;
                        }
                    }
                    if (numberOfHeroes >= 5) {
                        return;
                    }
                }*/

                //Купить лот с 2 героями со скидкой
                if (coins.value < discountedLotPrice) {
                    return;
                }
                for (let slot of shopSlots) {
                    let shouldSkipReward = isHero
                    ? (slot.reward.invasionFragmentHeroRand || slot.reward.invasionFragmentPet)
                    : (slot.reward.invasionFragmentTitanRand || slot.reward.invasionFragmentSkillRand || slot.reward.invasionFragmentSkill);

                    //Пропустить не нужные лоты (скрытые лоты, питомцев, купленные лоты)
                    if (shouldSkipReward || slot.bought != false ) {
                    //if (slot.reward.invasionFragmentHeroRand || slot.reward.invasionFragmentPet || slot.bought != false ) {
                        continue;
                    }
                    let invasionFragment = isHero ? slot.reward.invasionFragmentHero: slot.reward.invasionFragmentTitan;
                    if (Object.keys(invasionFragment).length == 2 && slot.cost.coin[1080] == discountedLotPrice){
                    //if (Object.keys(slot.reward.invasionFragmentHero).length == 2 && slot.cost.coin[1080] == discountedLotPrice){
                        if (coins.value >= slot.cost.coin[1080]) {
                            console.log('%cДва ненужных героя по скидке. ', 'color: green; font-weight: bold;');
                            await Caller.send({ name: 'shopBuy', args: { shopId: shopId, slot: slot.id } });
                            coins.value -= slot.cost.coin[1080];
                            let fragments = Object.keys(invasionFragment).map(Number);
                            //let fragments = Object.keys(slot.reward.invasionFragmentHero).map(Number);
                            console.log('Новые герои ', JSON.stringify(fragments));
                            for (let fragmentId of fragments) {
                                if (!allHeroes.includes(fragmentId)) {
                                    numberOfHeroes++;
                                    allHeroes.push(fragmentId);
                                }
                            }
                            console.log('allHeroes ', JSON.stringify(allHeroes));
                        }
                    }
                    if (numberOfHeroes >= 5) {
                        return;
                    }
                }

                //Куить лот с 2 рандомными героеями
                if (coins.value < randomRewardPrice) {
                    return
                }
                for (let slot of shopSlots) {
                    let invasionFragmentRand = isHero ? slot.reward.invasionFragmentHeroRand: slot.reward.invasionFragmentTitanRand;
                    if (invasionFragmentRand && slot.bought == false){
                        if (coins.value >= slot.cost.coin[1080]) {
                            console.log('%cДва случайных героя', 'color: green; font-weight: bold;');
                            let shopBuy = await Caller.send({ name: 'shopBuy', args: { shopId: shopId, slot: slot.id } });
                            coins.value -= slot.cost.coin[1080];
                            let invasionFragment = isHero ? shopBuy.invasionFragmentHero: shopBuy.invasionFragmentTitan;
                            let fragments = Object.keys(invasionFragment).map(Number);
                            //let fragments = Object.keys(shopBuy.invasionFragmentHero).map(Number);
                            console.log('Новые герои ', JSON.stringify(fragments));
                            for (let fragmentId of fragments) {
                                if (!allHeroes.includes(fragmentId)) {
                                    numberOfHeroes++;
                                    allHeroes.push(fragmentId);
                                }
                            }
                            console.log('allHeroes ', JSON.stringify(allHeroes));
                        }
                    }
                    if (numberOfHeroes >= 5) {
                        return;
                    }
                }
                //Обновить магазин
                if (coins.value >= discountedLotPrice + 3) {
                    shopSlots = await shopRefresh (shopId, coins);
                } else {
                    return;
                }
            }
        } catch (e) {
            console.log('%cПроизошла ошибка при покупке героя', 'color: red; font-weight: bold;');
            console.error(e);
        }
    }


    async function sellHeroes (heroIds, heroFragments, allHeroes, allAvailableFragments) {
        console.log("Id нужных героев > 7---------------");
        for (let i = 0; i < heroIds.length; i++) {
            if (heroFragments[i] > 7){
                console.log("Id " + heroIds[i] + " продали " + (heroFragments[i]-7));
                await Caller.send({name: "invasion_fragmentSell", args: {fragmentId: heroIds[i], amount: heroFragments[i]-7}});
            }
        }

        let maximumNumberOfHeroes = 5;
        if (heroIds[0] >= 4500 ) {
            maximumNumberOfHeroes = heroIds.length;
        }
        console.log("Id ненужных героев -------------");
        if (allHeroes.length > maximumNumberOfHeroes) {
            let counter = 0;
            for (let i = allHeroes.length - 1; i >= 0; i--) {
                if ((allHeroes.length - counter) == maximumNumberOfHeroes){
                    break;
                }
                if (heroIds.includes(allHeroes[i])){
                    continue;
                }
                console.log("Продали ненужного " + allHeroes[i]);
                await Caller.send({name: "invasion_fragmentSell", args: {fragmentId: allHeroes[i], amount: allAvailableFragments[allHeroes[i]]}});
                counter++;
            }
        }
    }

    async function buyHeroes (shopId, coins, heroIds, shopSlots, heroFragments) {
        let shopPinSlot = false;
        console.log("Зашли в закупку героев " + shopPinSlot);
        try {
            for (let slot of shopSlots) {
                //Пропустить скрытые лоты и питомцев
                if (slot.reward.invasionFragmentHeroRand || slot.reward.invasionFragmentPet || slot.bought) {
                    continue;
                }
                if (slot.pinned){
                    let unpinSlot = false;
                    let mas = Object.keys(slot.reward.invasionFragmentHero);
                    for (let id of mas){
                        let numberOfFragments = heroFragments[heroIds.indexOf(id)];
                        if(numberOfFragments > 6){
                            unpinSlot = true;
                            continue;
                        }
                        unpinSlot = false;
                        break;
                    }
                    if(unpinSlot == true){
                        await Caller.send({ name: 'shop_unpinSlot', args: { shopId: shopId, slotId: slot.id } });
                    }
                }

                //Покупки героев, когда собираем героев
                if (heroIds.length <= 3) {
                    for (let t = 0; t < heroIds.length; t++) {
                        if (slot.reward.invasionFragmentHero?.[heroIds[t]] && heroFragments[t] < 7) {
                            if (coins.value >= slot.cost.coin[1080]) {
                                await Caller.send({ name: 'shopBuy', args: { shopId: shopId, slot: slot.id } });
                                console.log('%cКуплен герой ', 'color: green; font-weight: bold;');
                                coins.value -= slot.cost.coin[1080];
                                heroFragments[t] += slot.reward.invasionFragmentHero?.[heroIds[t]];

                                //Если c первым героем есть другой
                                for (let i = t+1; i < heroIds.length; i++) {
                                    if (slot.reward.invasionFragmentHero?.[heroIds[i]]) {
                                        console.log('%cВторой герой в комплекте ', 'color: green; font-weight: bold;');
                                        heroFragments[i] += slot.reward.invasionFragmentHero?.[heroIds[i]];
                                        break;
                                    }
                                }
                            } else {
                                await Caller.send({ name: 'shop_pinSlot', args: { shopId: shopId, slotId: slot.id } });
                                shopPinSlot = true;
                            }
                            break;
                        }
                    }
                }

                //Покупки героев, когда проходим миссии
                if (heroIds.length > 3) {
                    //Если 2 героя в одном слоте
                    if (Object.values(slot.reward.invasionFragmentHero).length >= 2) {
                        for (let t = 0; t < heroIds.length; t++) {
                            let boughtSlot = false;
                            if (slot.reward.invasionFragmentHero?.[heroIds[t]] && heroFragments[t] < 7) {
                                //Два героя по скидке
                                if (slot.cost.coin[1080] == 16) {
                                    if (coins.value >= slot.cost.coin[1080]){
                                        await Caller.send({ name: 'shopBuy', args: { shopId: shopId, slot: slot.id } });
                                        console.log('%cДва героя со скидкой. Берем не думая. ', 'color: green; font-weight: bold;');
                                        coins.value -= slot.cost.coin[1080];
                                        boughtSlot = true;
                                        break;
                                    } else {
                                        await Caller.send({ name: 'shop_pinSlot', args: { shopId: shopId, slotId: slot.id } });
                                        shopPinSlot = true;
                                        break;
                                    }
                                }
                                //Если c первым героем есть другой
                                for (let i = t+1; i < heroIds.length; i++) {
                                    if (slot.reward.invasionFragmentHero?.[heroIds[i]]) {
                                        if (coins.value >= slot.cost.coin[1080]) {
                                            console.log('%cДва героя. Не оптом и не выгодно. Покупаем. ', 'color: green; font-weight: bold;');
                                            await Caller.send({ name: 'shopBuy', args: { shopId: shopId, slot: slot.id } });
                                            heroFragments[t] += slot.reward.invasionFragmentHero?.[heroIds[t]];
                                            heroFragments[i] += slot.reward.invasionFragmentHero?.[heroIds[i]];
                                            coins.value -= slot.cost.coin[1080];
                                        } else {
                                            await Caller.send({ name: 'shop_pinSlot', args: { shopId: shopId, slotId: slot.id } });
                                            shopPinSlot = true;
                                        }
                                        boughtSlot = true;
                                        break;
                                    }
                                }
                            }
                            if (boughtSlot) {
                                break;
                            }
                        }
                    }
                    //Если 1 герой в слоте
                    if (Object.values(slot.reward.invasionFragmentHero).length == 1) {
                        for (let t = 0; t < heroIds.length; t++) {
                            if (slot.reward.invasionFragmentHero?.[heroIds[t]] && heroFragments[t] < 7) {
                                if (coins.value >= slot.cost.coin[1080]) {
                                    await Caller.send({ name: 'shopBuy', args: { shopId: shopId, slot: slot.id } });
                                    console.log('%cКуплен герой ', 'color: green; font-weight: bold;');
                                    coins.value -= slot.cost.coin[1080];
                                    heroFragments[t] += slot.reward.invasionFragmentHero?.[heroIds[t]];
                                } else {
                                    await Caller.send({ name: 'shop_pinSlot', args: { shopId: shopId, slotId: slot.id } });
                                    shopPinSlot = true;
                                }
                                break;
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.log('%cПроизошла ошибка при покупке героя', 'color: red; font-weight: bold;');
            console.error(e);
        }
        console.log("Вышли с закупки героев " + shopPinSlot);
        return shopPinSlot;
    }

    async function buyItems (shopId, coins, shopSlots, itemsProgress, canSellItems ) {
        let shopPinSlot = false;
        let unitType = getUnitType(itemsProgress);
        let fragmentSellReward = lib.data.invasion.list[invasionInfoId].settings.fragmentSellReward
        const fragmentSellPrice = fragmentSellReward[unitType].coin[1080];

        console.log("Зашли в закупку героев " + shopPinSlot);
        try {
            for (let slot of shopSlots) {
                //Пропустить скрытые лоты и питомцев и уже купленный лот
                if (slot.reward.invasionFragmentHeroRand || slot.reward.invasionFragmentPet || slot.bought) {
                    continue;
                }
                const lot = slot.reward.invasionFragmentHero;
                const neededFragments = 7;
                const hasNeededSlot = Object.entries(lot).some(([heroId]) => {
                    const id = Number(heroId);
                    const currentFragments = itemsProgress[id];
                    return itemsProgress.hasOwnProperty(id) && currentFragments < neededFragments;
                });
                console.log("hasNeededSlot: " + hasNeededSlot + ' lot: ', JSON.stringify(lot) );

                if (slot.pinned && !hasNeededSlot){
                    await Caller.send({ name: 'shop_unpinSlot', args: { shopId: shopId, slotId: slot.id } });
                }

                if (hasNeededSlot) {
                    if (coins.value >= slot.cost.coin[1080]) {
                        await Caller.send({ name: 'shopBuy', args: { shopId: shopId, slot: slot.id } });
                        console.log('%cКуплен лот в магазине', 'color: green; font-weight: bold;');
                        coins.value -= slot.cost.coin[1080];

                        for (const [heroId, amount] of Object.entries(lot)) {
                            const id = Number(heroId);
                            const currentFragments = itemsProgress[id];
                            if (itemsProgress.hasOwnProperty(id) && currentFragments < neededFragments) {
                                itemsProgress[id] += amount;
                            } else {
                                if (canSellItems) {
                                    await Caller.send({name: "invasion_fragmentSell", args: {fragmentId: id, amount: amount}});
                                    console.log('%cПродали что то ненужное id' + id, 'color: green; font-weight: bold;');
                                    coins.value += fragmentSellPrice;
                                }
                            }
                        }
                    } else {
                        await Caller.send({ name: 'shop_pinSlot', args: { shopId: shopId, slotId: slot.id } });
                        console.log('%cНет деняг. Зарезервировали на потом', 'color: blue; font-weight: bold;');
                        shopPinSlot = true;
                    }
                }
            }
        } catch (e) {
            console.log('%cПроизошла ошибка при покупке героя', 'color: red; font-weight: bold;');
            console.error(e);
        }
        console.log("Вышли с закупки героев " + shopPinSlot);
        return shopPinSlot;
    }

    function getUnitType(data) {
        const firstId = Array.isArray(data) ? data[0] : Number(Object.keys(data)[0]);
        if (firstId < 1000) return "hero";
        if (firstId < 4500) return "titan";
        if (firstId < 6000) return "spiritSkill";
        return "pet";
    }

    async function buyPets (shopId, coins, pets, shopSlots, boughtAllHeroes) {
        try {
            for (let slot of shopSlots) {

                //Пропустить скрытые лоты и героев и купленный лот
                if (slot.reward.invasionFragmentHeroRand || slot.reward.invasionFragmentHero || slot.bought) {
                    continue;
                }
                for (let s = 0; s < pets.length; s++) {
                    if (slot.reward.invasionFragmentPet?.[pets[s]] ) {
                        if (coins.value >= slot.cost.coin[1080]) {
                            if (slot.cost.coin[1080] == 12 || coins.value <= 120 || boughtAllHeroes){
                                await Caller.send({ name: 'shopBuy', args: { shopId: shopId, slot: slot.id } });
                                console.log('%cКуплен питомец ', 'color: green; font-weight: bold;');
                                coins.value -= slot.cost.coin[1080];
                                pets.splice(pets.indexOf(pets[s]), 1)
                            }
                        } else {
                            //await Caller.send({ name: 'shop_pinSlot', args: { shopId: shopId, slotId: slot.id } });
                        }
                        break;
                    }
                }
                if (pets.length == 0) {
                    break;
                }

            }
        } catch (e) {
            console.log('%cПроизошла ошибка при покупке питомца', 'color: red; font-weight: bold;');
            console.error(e);
            coins.value = await Caller.send('inventoryGet').then((e) => e.coin[1080]);
        }
    }
    async function selectPets(petTeam, archdemon = false) {
        console.log('Переданные питомцы ', JSON.stringify(petTeam));
        //Получить id питомцев
        let allPets = Object.values(lib.data.pet).map(e => e.id);
        const shouldSavePetsId = 0;

        let savedPets = getSaveVal( archdemon ? 'savedPetsForArchdemon' : 'savedPetsToCompleteChapter', []);
        if (!Array.isArray(savedPets)){
            savedPets = [];
        }
        savedPets = savedPets.includes(shouldSavePetsId) ? savedPets : petTeam;
        console.log('savedPets ', JSON.stringify(savedPets));

        let chekPets = [];
        let pets = [];

        for (let pet of allPets) {
            chekPets.push({
                name:pet,
                label: cheats.translate(`LIB_HERO_NAME_${pet}`),
                checked: savedPets.includes(pet),
            });
        }
        chekPets.sort((a, b) => a.label.localeCompare(b.label));
        chekPets.unshift({
            name:shouldSavePetsId,
            label: I18N('NHR_SHOULD_SAVE_PETS'),
            title: I18N('NHR_SHOULD_SAVE_PETS_TITLE'),
            checked: savedPets.includes(shouldSavePetsId),
        });

        let answer = await popup.confirm(
            I18N('NHR_SELECT_PETS'),
            [
                { msg: I18N('NHR_NEXT'), result: true, color: 'green' },
                { msg: I18N('BTN_CANCEL'), result: false, isCancel: true, color: 'red' },
            ],
            chekPets
        );
        if (!answer) {
            return 'cancel';
        }
        const taskList = popup.getCheckBoxes();
        for (let pet of taskList) {
            if (pet.checked) {
                pets.push(Number(pet.name));
            }
        }
        if (pets.length > 0) {
            setSaveVal(archdemon ? 'savedPetsForArchdemon' : 'savedPetsToCompleteChapter', [...pets]);
        }
        pets = pets.filter(id => id !== shouldSavePetsId);
        return pets;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function attackTitanMission(missionId, chapterId, heroes, firstSpiritSkills, boss = false) {
        try {
            if (boss == true) {
                console.log('%cАтакуем босса ', 'color: green; font-weight: bold;');
            }
            const startBattle = await Caller.send({
                name: 'invasion_bossStart',
                args: {
                    id: missionId,
                    chapterId: chapterId,
                    heroes: heroes,
                    //firstSpiritElement: "earth",
                    firstSpiritSkills: firstSpiritSkills,
                    favor: {},
                },
            });
            const calcBattle = await Calc(startBattle);

            if (!calcBattle.result.win) {
                const cloneBattle = structuredClone(startBattle);
                const bFix = new NewCharacterWinFixBattle(cloneBattle);
                bFix.isGetTimer = false;
                bFix.minTimer = 0;
                bFix.maxTimer = 60;
                bFix.startingNumberOfFixes = 30;

                let result = await bFix.start(cloneBattle.endTime, Infinity);
                if (result.result?.win) {
                    calcBattle.result = result.result;
                    calcBattle.progress = result.progress;
                    calcBattle.battleTimer = result.battleTimer;
                }
            }

            if (!calcBattle.result.win && boss == true) {
                //Босса не убили
                console.log('%cБосса не убили ', 'color: red; font-weight: bold;');
                return;
            }
            if (boss == true) {
                let timer = calcBattle.battleTimer;
                console.log('%cУбили босса', 'color: green; font-weight: bold;');
                let message = I18N('NT_BOSS_WAS_KILLED_SET_PROGRESS_1');
                setProgress(message, false);
                await new Promise((e) => setTimeout(e, 1000));
                message += I18N('NT_BOSS_WAS_KILLED_SET_PROGRESS_2');
                setProgress(message, false);
                await new Promise((e) => setTimeout(e, 1000));
                message += I18N('NT_BOSS_WAS_KILLED_SET_PROGRESS_3');
                setProgress(message, false);
                await new Promise((e) => setTimeout(e, 1000));
                message += I18N('NT_BOSS_WAS_KILLED_SET_PROGRESS_4');
                setProgress(message, false);
                await new Promise((e) => setTimeout(e, 1000));
                message += I18N('NT_BOSS_WAS_KILLED_SET_PROGRESS_5');
                await countdownTimer(timer, message);
            }

            const endBattle = await Caller.send({
                name: 'invasion_bossEnd',
                args: {
                    id: missionId,
                    result: calcBattle.result,
                    progress: calcBattle.progress,
                },
            });
            return false;
        } catch (e) {
            return true;
        }
    }

    async function attackHeroMission(missionId, chapterId, heroes, pet, boss = false, petsFavor) {
        try {
            if (boss == true) {
                console.log('%cАтакуем босса ', 'color: green; font-weight: bold;');
            }
            const startBattle = await Caller.send({
                name: 'invasion_bossStart',
                args: {
                    id: missionId,
                    chapterId: chapterId,
                    heroes: heroes,
                    pet: pet,
                    favor: petsFavor,
                },
            });
            const calcBattle = await Calc(startBattle);

            if (!calcBattle.result.win) {
                const cloneBattle = structuredClone(startBattle);
                const bFix = new NewCharacterWinFixBattle(cloneBattle);
                bFix.isGetTimer = false;
                bFix.minTimer = 0;
                bFix.maxTimer = 30;
                bFix.startingNumberOfFixes = 30;
                let result = await bFix.start(cloneBattle.endTime, Infinity);
                if (result.result?.win) {
                    calcBattle.result = result.result;
                    calcBattle.progress = result.progress;
                    calcBattle.battleTimer = result.battleTimer;
                }
            }

            if (!calcBattle.result.win && boss == true) {
                //Босса не убили
                console.log('%cБосса не убили ', 'color: red; font-weight: bold;');
                return;
            }
            if (boss == true) {
                let timer = calcBattle.battleTimer;
                console.log('%cУбили босса', 'color: green; font-weight: bold;');
                let message = I18N('NT_BOSS_WAS_KILLED_SET_PROGRESS_1');
                setProgress(message, false);
                await new Promise((e) => setTimeout(e, 1000));
                message += I18N('NT_BOSS_WAS_KILLED_SET_PROGRESS_2');
                setProgress(message, false);
                await new Promise((e) => setTimeout(e, 1000));
                message += I18N('NT_BOSS_WAS_KILLED_SET_PROGRESS_3');
                setProgress(message, false);
                await new Promise((e) => setTimeout(e, 1000));
                message += I18N('NT_BOSS_WAS_KILLED_SET_PROGRESS_4');
                setProgress(message, false);
                await new Promise((e) => setTimeout(e, 1000));
                message += I18N('NT_BOSS_WAS_KILLED_SET_PROGRESS_5');
                await countdownTimer(timer, message);
            }

            await Caller.send({
                name: 'invasion_bossEnd',
                args: {
                    id: missionId,
                    result: calcBattle.result,
                    progress: calcBattle.progress,
                },
            });
            return false;
        } catch (e) {
            return true;
        }
    }
    //****************************************************************************************************
    //****************************************************************************************************
    //****************************************************************************************************
    //****************************************************************************************************
    async function attackArchdemon() {
        //Получить состояние на карте
        let invasionInfo = await Caller.send('invasion_getInfo');
        console.log(invasionInfo);

        const relicId = Object.values(lib.data.invasion.list).find((e) => e.id == invasionInfoId).settings.relicId;
        console.log('relicId ' + relicId);
        const relicLevel = (await Caller.send('workshop_getInfo')).relics.find((e) => e.id == relicId).level;
        console.log('relicLevel ' + relicLevel);
        let buffAmount = relicLevel <= 1 ? 0 : relicLevel * 10;
        console.log(buffAmount);
        let archdemon = true;
        let missionRaid = false;
        console.log('invasionInfoId ', JSON.stringify(invasionInfoId));

        const selectedChapter = await chooseAbyssChapter(buffAmount, Number(relicLevel));
        if (!selectedChapter) {
            return returnToNewHeroMenu();
        }

        let chapterId = selectedChapter.chapterId;
        let chapterNumber = selectedChapter.chapterNumber;
        /*Питомцы
        6000 - Фенрис   6005 - Альбрус
        6001 - Оливер	6006 - Аксель
        6002 - Мерлин   6007 - Бисквит
        6003 - Мара	    6008 - Хорус
        6004 - Каин	    6009 - Векс*/

        let heroAttackingTeams = {heroes: [[17,13,72,46,61], [13,17,46,50,72], [40,29,52,46,73]],
                                  pets: [[6002, 6006], [6002,6005,6006], [6008, 6002, 6004, 6001]]};

        let heroIds = heroAttackingTeams.heroes[0];
        let pets = heroAttackingTeams.pets[0];

        //Кнопка ввод Id героев, что необходимо собрать
        console.log("chapterNumber: chapterNumber " + chapterNumber);
        let resultGetTeamButton = await getTeamButton(heroAttackingTeams.heroes, chapterNumber, archdemon);
        if (resultGetTeamButton === 'cancel'){
            return returnToNewHeroMenu();
        }
        heroIds = resultGetTeamButton.team;
        let teamIndex = resultGetTeamButton.teamIndex;
        console.log('heroIds ', JSON.stringify(heroIds));
        console.log('teamIndex ', JSON.stringify(teamIndex));
        //Получить id питомцев
        pets = await selectPets(heroAttackingTeams.pets?.[teamIndex] ?? [], archdemon);
        if (pets === 'cancel'){
            return returnToNewHeroMenu();
        }
        console.log('pets ', JSON.stringify(pets));

        //Получить id талисмана
        let talismanId = await chooseTalisman();
        if (talismanId === 'cancel'){
            return returnToNewHeroMenu();
        }
        console.log('talismanId ', JSON.stringify(talismanId));

/////////////////////////////////////////////////////////////////////////////////////////
        setProgress(I18N('NT_LETS_START'), false);
        await new Promise((e) => setTimeout(e, 2000));

        //Активировать главу
        let chapterInfo = await Caller.send({ name: 'invasion_setActiveChapter', args: { chapterId: chapterId } });

        //Id миссии
        let firstMissionId = chapterInfo.invasion.actions[0].payload.id;
        let missionId = firstMissionId;
        let lastMissionId = chapterInfo.invasion.actions[chapterInfo.invasion.actions.length-1].payload.id;
        let missionNumber = 1;

        //Жизни
        let lives = chapterInfo.invasion.lives;
        console.log('firstMissionId ' + firstMissionId);
        console.log('missionId ' + missionId);
        console.log('lives ' + lives);
        while (lives > 0) {
            //Купить героев
            let result = await buyHeroesAndPets(missionNumber, lives, heroIds, pets);

            //Текущая миссия босс или нет
            let boss = false;

            //Атаковать / не атаковать босса
            if (missionId == lastMissionId) {
                boss = true;
            }

            //Получить атакующую команду
            let have = await getAttackingTeam();
            let heroes = have.heroes;
            let havePets = have.other;
            let allHeroes = have.allHeroes;
            let pet;
            let petsFavor = {};

            const haveAllAttackingTeams = (arr, values) => {
                return values.every(v => arr.includes(v));
            };
            if (haveAllAttackingTeams(allHeroes, heroIds)) {
                heroes = heroIds;
            }
            console.log('allHeroes ', JSON.stringify(allHeroes));
            console.log('heroes ', JSON.stringify(heroes));

            if (havePets.length > 0) {
                pet = havePets[0];
                //Покровительство
                const petLib = lib.getData('pet');
                for (let heroId of heroes) {
                    /** Поиск питомца для героя */
                    for (let petId of havePets) {
                        if (petLib[petId].favorHeroes.includes(heroId)) {
                            petsFavor[heroId] = petId;
                            havePets = havePets.filter((e) => e != petId);
                            break;
                        };
                    }
                }
            }

            //Проходим миссию
            //Выход перед Архидемоном
            if (boss) {
                setProgress('', true);
                await popup.confirm(I18N('NHR_ARCHDEMON_IS_PREPARED'));
                cheats.refreshGame();
                return;
            }

            if (!boss) {
                setProgress(I18N('NT_MISSION_PROGRESS', {missionNumber: missionNumber}), false);
            } else {
                setProgress(I18N('NT_MISSION_PROGRESS_BOSS'), false);
            }
            await new Promise((e) => setTimeout(e, 2000));

            let error = await attackHeroMission(missionId, chapterId, heroes, pet, boss, petsFavor);
            if (error) {
                await popup.confirm(I18N('NEW_CHARACTER_SOMETHING_WENT_WRONG'));
                return;
            }

            //Результат атаки
            let invasionInfo = await Caller.send('invasion_getInfo');
            lives = invasionInfo.lives;
            if (lives == 0) {
                setProgress('', true);
                await popup.confirm(I18N('NHR_LIVES_ARE_OVER', { chapterNumber: romanNumerals[chapterNumber]}));
                return;
            }

            //Купить талисман
            if (invasionInfo?.talismans?.length === 0) {
                const talismanRerollsLeft = invasionInfo?.talismanRerollsLeft ?? 0;
                const shouldResetChapter = await manageTalisman(talismanRerollsLeft, talismanId, missionRaid, chapterId);
                //Сбрасываем главу если не купили талисман
                if (shouldResetChapter){
                    setProgress(I18N('NHR_RESET_CHAPTER'), false);
                    await new Promise((e) => setTimeout(e, 1000));
                    invasionInfo = await resetChapter(chapterId);
                }
            }

            let missions = Object.values(invasionInfo.actions);
            let nextMissionIndex = missions.findIndex(e => e.payload.wins === 0);
            if (nextMissionIndex == -1) {
                setProgress('', true);
                await popup.confirm(I18N('NHR_LIVES_ARE_OVER', { chapterNumber: romanNumerals[chapterNumber]}));
                return;
            }
            missionId = missions[nextMissionIndex].payload.id;
            missionNumber = nextMissionIndex + 1;
        }
    }

    async function manageTalisman(talismanRerollsLeft, talismanId, missionRaid, chapterId) {
        let shouldResetChapter = false;
        let boughtTalisman = await buyTalisman(talismanId, missionRaid);
        if (!boughtTalisman) {
            const sealCost = getChapterSealCost(chapterId);

            //При нулевой стоимости
            if (!sealCost) {
                shouldResetChapter = true;
                return shouldResetChapter;
            }

            for (let reroll = 1; reroll <= talismanRerollsLeft; reroll++) {
                setProgress(I18N('NHR_ROLL_TALISMANS', {rerollCounter: reroll}), false);
                await new Promise((e) => setTimeout(e, 2000));
                boughtTalisman = await buyTalisman(talismanId, missionRaid);
                await new Promise((e) => setTimeout(e, 2000));
                if (boughtTalisman) break;
            }

            // Берем чё дали
            if (!boughtTalisman) {
                setProgress(I18N('NHR_KEEP_ANY_TALISMAN'), false);
                await new Promise((e) => setTimeout(e, 2000));
                boughtTalisman = await buyTalisman(0, missionRaid);
            }
        }

        //Если куплен талисман Капитала
        if (boughtTalisman && talismanId == 8008) {
            await popup.confirm(I18N('NHR_BOUGHT_CAPITAL_TALISMAN'));
            location.reload();
        }
        return shouldResetChapter;
    }

    //Сколько печатей стоит старт главы
    function getChapterSealCost(chapterId) {
        const sealId = getAbyssSealId();
        return Number(lib.data.invasion.chapter[chapterId]?.startCost?.coin?.[sealId] ?? 0);
    }

    //Выбор главы
    async function chooseAbyssChapter(buffAmount, relicLevel) {
        const chapters = Object.values(lib.data.invasion.chapter).filter((e) => e.invasionId === invasionInfoId && e?.isArchdemon !== false);
        if (!chapters.length) {
            await popup.confirm(I18N('NHR_NO_ABYSS_CHAPTER'));
            return 0;
        }
        const sealId = getAbyssSealId();
        const inventory = await Caller.send('inventoryGet');
        const seals = Number(inventory?.coin?.[sealId] ?? 0);
        const savedChapter = getSaveVal('savedChapterForArchdemon', 0);
        console.log('Печатей Бездны ' + seals);

        let chekChapters = [];
        let available = {};
        for (let i = 0; i < chapters.length; i++) {
            const chapter = chapters[i];
            const cost = Number(chapter.startCost?.coin?.[sealId] ?? 0);
            const needLevel = Number(chapter.requirements?.invasionRelic ?? 0);
            const needBuff = needLevel * 10;
            const attempts = cost > 0 ? Math.floor(seals / cost) : 0;
            available[chapter.id] = buffAmount >= needBuff && (cost === 0 || attempts > 0);
            //Показываем и цену, и требование Амулета: заблокировать может любое из двух
            let costText = cost > 0
                ? I18N('NHR_ABYSS_COST', { color: seals >= cost ? 'green' : 'red', seals, cost: getSealsHtml(cost, 'currentcolor')})
                : I18N('NHR_ABYSS_FREE');
            if (buffAmount < needBuff) {
                costText += '<br>' + I18N('NHR_ABYSS_NEED_RELIC', { needBuff, haveBuff: relicLevel * 10});
            }
            chekChapters.push({
                name: chapter.id,
                //Цену заворачиваем в span: метка это inline-flex, и <br> в ней сам по себе не переносит
                label: getChapterTitle(chapter, i + 1) + `&nbsp&mdash;&nbsp<span>` + costText + `</span>`,
                radio: 'chapters',
                checked: chapter.id == savedChapter,
            });
        }
        //Недоступную главу по умолчанию не отмечаем
        const firstAvailable = chekChapters.find((e) => available[e.name]);
        if (!chekChapters.some((e) => e.checked && available[e.name])) {
            chekChapters.forEach((e) => { e.checked = e === firstAvailable; });
        }
        if (!firstAvailable) {
            await popup.confirm(I18N('NHR_NO_ABYSS_CHAPTER_AVAILABLE', { relicName: getAbyssRelicName(), sealName: getAbyssSealName() }));
            return 0;
        }

        //Попап строит разметку сразу, поэтому промис ждём после вставки заголовка
        let answer = popup.confirm(
            I18N('NHR_SELECT_CHAPTER') + '<span style="font-size: 0.7em; vertical-align: super; margin-left: 3px;">&copy;</span> X-ntario',
            [
                { msg: I18N('NHR_NEXT'), result: true, color: 'green' },
                { msg: I18N('BTN_CANCEL'), result: false, isCancel: true, color: 'red' },
            ],
            chekChapters
        );
        //Сколько печатей на руках - строкой над списком, в метку класть нельзя
        removeAbyssHeaders();
        const firstCheckbox = document.querySelector('.PopUp_checkbox.radio_chapters');
        if (firstCheckbox) {
            const header = document.createElement('div');
            header.classList.add('PopUp_text', 'NHR_abyssHeader');
            header.style.fontSize = '16px';
            header.style.textAlign = 'left';
            header.style.margin = '0px 0px 6px 0px';
            header.innerHTML = I18N('NHR_ABYSS_TOTAL', {sealName: getAbyssSealName()}) + '&nbsp' + getSealsHtml(seals);
            firstCheckbox.parentNode.before(header);
        }
        disableLockedChapters(available);
        const isNext = await answer;
        removeAbyssHeaders();
        if (!isNext) {
            return 0;
        }

        const taskList = popup.getCheckBoxes();
        for (let i = 0; i < taskList.length; i++) {
            if (!taskList[i].checked) continue;
            const chapterId = Number(taskList[i].name);
            if (!available[chapterId]) {
                await popup.confirm(I18N('NHR_NOT_ENOUGH_SEALS'));
                return 0;
            }
            setSaveVal('savedChapterForArchdemon', chapterId);
            return { chapterId, chapterNumber: i + 1 };
        }
        return 0;
    }

    function removeAbyssHeaders() {
        document.querySelectorAll('.NHR_abyssHeader').forEach((e) => e.remove());
    }

    //Недоступную главу гасим и не даём выбрать: отметка возвращается на последнюю доступную.
    //Причин недоступности две - не хватает Амулета или печатей
    function disableLockedChapters(available) {
        const checkBoxes = [...document.querySelectorAll('.PopUp_checkbox.radio_chapters')];
        const isAvailable = (cb) => !!available[Number(cb.dataset.name)];
        let lastAvailable = checkBoxes.find((cb) => cb.checked && isAvailable(cb)) ?? checkBoxes.find(isAvailable);
        for (const cb of checkBoxes) {
            if (!isAvailable(cb) && cb.nextElementSibling) {
                cb.nextElementSibling.style.opacity = '0.35';
            }
            cb.addEventListener('change', () => {
                if (!cb.checked) {
                    return;
                }
                if (isAvailable(cb)) {
                    lastAvailable = cb;
                    return;
                }
                checkBoxes.forEach((e) => { e.checked = e === lastAvailable; });
            });
        }
    }

    //У глав Бездны есть свои названия: Край Бездны, Сердце Бездны, Абсолютная Бездна
    function getChapterTitle(chapter, chapterNumber) {
        const romanNumber = `<span style= "font-family: 'Times New Roman';">` + romanNumerals[chapterNumber] + `</span>`;
        try {
            const title = chapter.clientData?.titleLocale ? cheats.translate(chapter.clientData.titleLocale) : '';
            if (title && title !== chapter.clientData.titleLocale) {
                return romanNumber + '&nbsp' + title;
            }
        } catch (e) {}
        return I18N('NHR_CHAPTER') + '&nbsp' + romanNumber;
    }
    //Печати как в игре: значок, справа количество, в подсказке название и число.
    //Без значка название выводим текстом, чтобы число не висело в воздухе
    function getSealsHtml(count, color = 'LimeGreen') {
        const sealTitle = getAbyssSealName();
        if (!ABYSS_SEAL_ICON) {
            return (sealTitle ? sealTitle + '&nbsp' : '') + `<span style="color: ${color};">${count}</span>`;
        }
        const hint = (sealTitle ? sealTitle + ': ' + count : String(count)).replace(/"/g, '&quot;');
        return `<span style="color: ${color};" title="${hint}">${count}</span>` +
        `&nbsp<img src="${ABYSS_SEAL_ICON}" title="${hint}" style="height: 22px; vertical-align: middle;">`;
    }

    //Название печати берём из игры, чтобы совпадало с языком клиента
    function getAbyssSealName() {
        const item = lib.data.inventoryItem?.coin?.[getAbyssSealId()];
        try {
            return item?.name_localeKey ? cheats.translate(item.name_localeKey) : '';
        } catch (e) {
            return '';
        }
    }

    function getAbyssRelicName() {
        const relicId = Object.values(lib.data.invasion.list).find((e) => e.id == invasionInfoId)?.settings?.relicId;
        try {
            const relic = lib.data.workshop?.relic?.[relicId];
            return relic?.nameLocale ? cheats.translate(relic.nameLocale) : '';
        } catch (e) {
            return '';
        }
    }

    function getAbyssSealId() {
        return Object.values(lib.data.invasion.list).find((e) => e.id == invasionInfoId)?.settings?.abyssSealCoinId ?? 0;
    }


    //Иконка Печати Бездны, 64x64. Вырезана из атласа quest_icons2 по координатам
    //из quest_icons2.xml: <SubTexture name="seal_of_abyss" x="878" y="294" width="144" height="144"/>
    const ABYSS_SEAL_ICON = 'data:image/png;base64,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';


    class NewCharacterWinFixBattle extends WinFixBattle {
        minTimer = 0;
        maxTimer = 20;
        startingNumberOfFixes = 20;
        battleTime;
        divisionStep;
        step;
        stepСhangeСounter = 1;

        randTimer() {
            if (this.battleTime == this.minTimer) {
                this.divisionStep = this.startingNumberOfFixes;
                this.step = (this.maxTimer-this.minTimer) / this.divisionStep;
                console.log("%cШаг " + this.stepСhangeСounter + " = " + this.step + " maxTimer = " + this.maxTimer, "color: red; font-weight: bold;");
                this.battleTime += this.step;
                return this.battleTime;
            };
            if (this.battleTime >= this.maxTimer) {
                this.stepСhangeСounter++;
                this.divisionStep *= 2;
                this.step = (this.maxTimer-this.minTimer) / this.divisionStep;
                console.log("%cШаг " + this.stepСhangeСounter + " = " + this.step + " maxTimer = " + this.maxTimer, "color: red; font-weight: bold;")
                this.battleTime = this.minTimer + this.step;
                return this.battleTime;
            };

            if (this.stepСhangeСounter == 1){
                this.battleTime += this.step;
                return this.battleTime;
            }else{
                this.battleTime += this.step*2;
                return this.battleTime;
            }
        }
        async start(endTime = Date.now() + 6e4, maxCount = 100) {
            this.battleTime = this.minTimer;
            this.stepСhangeСounter = 1;
            maxCount = 888;
            this.endTime = endTime;
            this.maxCount = maxCount;
            this.init();
            return await new Promise((resolve) => {
                this.resolve = resolve;
                this.count = 0;
                this.loop();
            });
        }
    }
})();
