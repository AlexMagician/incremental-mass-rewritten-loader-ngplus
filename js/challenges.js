function setupChalHTML() {
    let chals_table = new Element("chals_table")
	let table = ""
	for (let x = 1; x <= CHALS.cols; x++) {
        table += `<div id="chal_div_${x}" style="width: 120px; margin: 5px;"><img id="chal_btn_${x}" onclick="CHALS.choose(${x})" class="img_chal" src="images/chal_${x}.png"><br><span id="chal_comp_${x}">X</span></div>`
	}
	chals_table.setHTML(table)
}

function updateChalHTML() {
    if (tmp.stab[3]==0){
        for (let x = 1; x <= CHALS.cols; x++) {
            let chal = CHALS[x]
            let unl = chal.unl ? chal.unl() : true
            tmp.el["chal_div_"+x].setDisplay(unl)
            tmp.el["chal_btn_"+x].setClasses({img_chal: true, ch: CHALS.inChal(x), chal_comp: player.chal.comps[x].gte(tmp.chal.max[x])})
            if (unl) {
                tmp.el["chal_comp_"+x].setTxt(format(player.chal.comps[x],0)+" / "+format(tmp.chal.max[x],0))
				if(hasPrestige(1,25) && x <= 11)tmp.el["chal_comp_"+x].setTxt(format(player.chal.comps[x],0));
				if(hasElement(133) && x == 12)tmp.el["chal_comp_"+x].setTxt(format(player.chal.comps[x],0));
				if(hasElement(222) && x == 13)tmp.el["chal_comp_"+x].setTxt(format(player.chal.comps[x],0));
				if(hasElement(289) && x == 14)tmp.el["chal_comp_"+x].setTxt(format(player.chal.comps[x],0));
				if(hasElement(289) && x == 15)tmp.el["chal_comp_"+x].setTxt(format(player.chal.comps[x],0));
				if(hasElement(302) && x == 16)tmp.el["chal_comp_"+x].setTxt(format(player.chal.comps[x],0));
				if(hasElement(308) && x == 17)tmp.el["chal_comp_"+x].setTxt(format(player.chal.comps[x],0));
				if(hasElement(316) && x == 18)tmp.el["chal_comp_"+x].setTxt(format(player.chal.comps[x],0));
				if(hasElement(316) && x == 19)tmp.el["chal_comp_"+x].setTxt(format(player.chal.comps[x],0));
            }
        }
        tmp.el.chal_enter.setVisible(player.chal.active != player.chal.choosed)
        tmp.el.chal_exit.setVisible(player.chal.active != 0)
        tmp.el.chal_exit.setTxt(tmp.chal.canFinish && !hasTree("qol6") ? "Finish Challenge for +"+tmp.chal.gain+" Completions" : "Exit Challenge")
        tmp.el.chal_desc_div.setDisplay(player.chal.choosed != 0)
        if (player.chal.choosed != 0) {
            let chal = CHALS[player.chal.choosed]
            tmp.el.chal_ch_title.setTxt(`[${player.chal.choosed}]${CHALS.getScaleName(player.chal.choosed)} ${chal.title} [${format(player.chal.comps[player.chal.choosed],0)+"/"+format(tmp.chal.max[player.chal.choosed],0)} Completions]`)
            tmp.el.chal_ch_desc.setHTML(chal.desc)
            tmp.el.chal_ch_reset.setTxt(CHALS.getReset(player.chal.choosed))
            tmp.el.chal_ch_goal.setTxt("Goal: "+CHALS.getFormat(player.chal.choosed)(tmp.chal.goal[player.chal.choosed])+CHALS.getResName(player.chal.choosed))
            tmp.el.chal_ch_reward.setHTML("Reward: "+chal.reward)
			if(player.chal.choosed == 1)tmp.el.chal_ch_reward.setHTML("Reward: "+chal.reward())
			if(player.chal.choosed == 5)tmp.el.chal_ch_reward.setHTML("Reward: "+chal.reward())
			if(player.chal.choosed == 7)tmp.el.chal_ch_reward.setHTML("Reward: "+chal.reward())
			if(player.chal.choosed == 14)tmp.el.chal_ch_reward.setHTML("Reward: "+chal.reward())
            tmp.el.chal_ch_eff.setHTML("Currently: "+chal.effDesc(tmp.chal.eff[player.chal.choosed]))
        }
    }
    if (tmp.stab[3]==1){
        updateQCHTML()
    }
    if (tmp.stab[3]==2){
        updateGCHTML()
    }
}

function updateChalTemp() {
    if (!tmp.chal) tmp.chal = {
        goal: {},
        max: {},
        eff: {},
        bulk: {},
        canFinish: false,
        gain: E(0),
    }
    let s = tmp.qu.chroma_eff[2]
    for (let x = 1; x <= CHALS.cols; x++) {
        let data = CHALS.getChalData(x)
        tmp.chal.max[x] = CHALS.getMax(x)
        tmp.chal.goal[x] = data.goal
        tmp.chal.bulk[x] = data.bulk
        tmp.chal.eff[x] = CHALS[x].effect(FERMIONS.onActive("05")?E(0):player.chal.comps[x].mul(x<=8?s:1))
    }
    tmp.chal.format = player.chal.active != 0 ? CHALS.getFormat() : format
    tmp.chal.gain = player.chal.active != 0 ? tmp.chal.bulk[player.chal.active].min(tmp.chal.max[player.chal.active]).sub(player.chal.comps[player.chal.active]).max(0).floor() : E(0)
    tmp.chal.canFinish = player.chal.active != 0 ? tmp.chal.bulk[player.chal.active].gt(player.chal.comps[player.chal.active]) : false
}

const CHALS = {
    choose(x) {
        if (player.chal.choosed == x) {
            this.enter()
        }
        player.chal.choosed = x
    },
    inChal(x) {
		if(player.supernova.fermions.choosed.startsWith("2") || player.supernova.fermions.choosed.startsWith("3"))if(x == 13)return true
		if(player.supernova.fermions.choosed.startsWith("3"))if(x == 16)return true
		if(FERMIONS.onActive("22"))if(x == 20)return true
		if(player.gc.active && x <= player.gc.trap)return true
		//if(player.gc.active)if(x == 13)return true
		return player.chal.active == x
	},
    reset(x, chal_reset=true) {
        if (x < 5) FORMS.bh.doReset()
        else if (x < 9) ATOM.doReset(chal_reset)
        else if (x < 13) SUPERNOVA.reset(true, true)
		else if (x < 17) {
			INFINITY_LAYER.doReset();
			updateTemp();
			updateTemp();
			updateTemp();
			updateTemp();
			updateTemp();
			if(x == 14 && chal_reset == false){
				player.qu.rip.active = true;
				QUANTUM.enter(false,true,true)
			}
			if(x == 16 && chal_reset == false){
				player.prestigeMass = E(0);
			}
		}else if (x < 21) {
			ETERNITY_LAYER.doReset();
			updateTemp();
			updateTemp();
			updateTemp();
			updateTemp();
			updateTemp();
			if(x == 19 && chal_reset == false){
				player.qu.rip.active = true;
				QUANTUM.enter(false,true,true)
				player.prestigeMass = E(0);
			}
		}else{
			EXOTIC.doReset();
			updateTemp();
			updateTemp();
			updateTemp();
			updateTemp();
			updateTemp();
		}
    },
    exit(auto=false) {
        if (!player.chal.active == 0) {
            if (tmp.chal.canFinish) {
                player.chal.comps[player.chal.active] = player.chal.comps[player.chal.active].add(tmp.chal.gain).min(tmp.chal.max[player.chal.active])
            }
            if (!auto) {
                this.reset(player.chal.active)
                player.chal.active = 0
            }
        }
    },
    enter() {
        if (player.chal.active == 0) {
            player.chal.active = player.chal.choosed
            this.reset(player.chal.choosed, false)
        } else if (player.chal.choosed != player.chal.active) {
            if (tmp.chal.canFinish) {
                player.chal.comps[player.chal.active] = player.chal.comps[player.chal.active].add(tmp.chal.gain).min(tmp.chal.max[player.chal.active])
            }
            this.reset(player.chal.active)
            player.chal.active = player.chal.choosed
            this.reset(player.chal.choosed, false)
        }
    },
    getResource(x, y) {
		if (x == 20 && y == 1) return player.mass.add(1).log10()
        if (x < 5 || x > 8) return player.mass
        return player.bh.mass
    },
    getResName(x) {
        if (x < 5 || x > 8) return ''
        return ' of Black Hole'
    },
    getFormat(x) {
        return formatMass
    },
    getReset(x) {
        if (x < 5) return "Entering challenge will force a Dark Matters reset!"
        if (x < 9) return "Entering challenge will force an Atoms reset (except previous challenges)!"
        if (x < 13) return "Entering challenge will reset without being Supernova!"
        if (x < 17) return "Entering challenge will force an Infinity reset!"
		if (x < 21) return "Entering challenge will force an Eternity reset!"
		return "Entering challenge will force an Exotic reset!"
    },
    getMax(i) {
        if (hasPrestige(1,25) && (i<=11)) return EINF
        if (hasElement(133) && (i==12)) return EINF
        if (hasElement(222) && (i==13)) return EINF
        if (hasElement(289) && (i==14||i==15)) return EINF
        if (hasElement(302) && (i==16)) return EINF
        if (hasElement(308) && (i==17)) return EINF
        if (hasElement(316) && (i==18||i==19)) return EINF
		
        let x = this[i].max
        if (i <= 4) x = x.add(tmp.chal?tmp.chal.eff[7]:0)
        if (hasElement(13) && (i==5||i==6)) x = x.add(tmp.elements.effect[13])
        if (hasElement(20) && (i==7)) x = x.add(50)
        if (hasElement(41) && (i==7)) x = x.add(50)
        if (hasElement(60) && (i==7)) x = x.add(100)
        if (hasElement(33) && (i==8)) x = x.add(50)
        if (hasElement(56) && (i==8)) x = x.add(200)
        if (hasElement(65) && (i==7||i==8)) x = x.add(200)
        if (hasElement(70) && (i==7||i==8)) x = x.add(200)
        if (hasElement(73) && (i==5||i==6||i==8)) x = x.add(tmp.elements.effect[73])
        if (hasTree("chal1") && (i==7||i==8))  x = x.add(100)
        if (hasTree("chal4b") && (i==9))  x = x.add(100)
        if (hasTree("chal8") && (i>=9 && i<=12))  x = x.add(200)
        if (hasElement(104) && (i>=9 && i<=12))  x = x.add(200)
        if (hasTree("chal9") && (i==9))  x = x.add(2000)
        if (hasTree("chal10") && (i==10))  x = x.add(500)
        if (hasTree("chal10") && (i==11))  x = x.add(500)
        if (hasTree("chal11") && (i==9))  x = x.add(500)
        if (hasTree("chal11") && (i==10))  x = x.add(500)
        if (hasTree("chal11") && (i==11))  x = x.add(500)
        if (hasTree("chal12") && (i==9))  x = x.add(1900)
        if (hasTree("chal12") && (i==10))  x = x.add(3500)
        if (hasTree("chal12") && (i==11))  x = x.add(3500)
        if (hasTree("chal13") && (i>=9 && i<=11))  x = x.add(5000)
        if (hasTree("chal14") && (i==12))  x = x.add(900)
        if (hasPrestige(1,13) && (i==12))  x = x.add(100)
        if (hasPrestige(0,129) && (i>=9 && i<=11))  x = x.add(5000)
        if (player.ranks.hex.gte(20) && (i==7)) x = x.add(1e5)
        if (player.ranks.hex.gte(41) && (i==12)) x = x.add(500)
        if (player.ranks.hex.gte(56) && (i==12)) x = x.add(500)
        if (player.ranks.hex.gte(60) && (i==12)) x = x.add(500)
        if (player.ranks.hex.gte(65) && (i==12)) x = x.add(1000)
        if (player.ranks.hex.gte(70) && (i==12)) x = x.add(1000)
        if (player.ranks.hex.gte(73) && (i==12)) x = x.add(1000)
        if (player.ranks.hex.gte(104) && (i==12)) x = x.add(2000)
        if (player.ranks.hex.gte(110) && (i==12)) x = x.add(2000)
        if (hasElement(175) && (i==13||i==15))  x = x.add(100)
        if (hasElement(182) && (i==13||i==16))  x = x.add(100)
        if (hasElement(186) && (i==13||i==15))  x = x.add(300)
        if (hasElement(190) && (i==13||i==16))  x = x.add(200)
        if (hasElement(194) && (i==13))  x = x.add(200)
        if (hasElement(204) && (i==13))  x = x.add(1000)
        if (hasElement(206) && (i==14||i==16))  x = x.add(100)
        if (hasElement(210) && (i==14||i==17))  x = x.add(100)
        if (hasElement(214) && (i==15||i==16))  x = x.add(200)
		if (i<=16)x = x.add(SUPERNOVA_GALAXY.effects.chal())
		if (i<=20 && i>=17)x = x.add(SUPERNOVA_GALAXY.effects.chal2())
        if (hasElement(227) && (i==17))  x = x.add(300)
        if (hasElement(235) && (i==19))  x = x.add(300)
        if (hasElement(236) && (i==18))  x = x.add(300)
        if (hasElement(247) && (i==14))  x = x.add(400)
		if (hasElement(249) && (i==18||i==19))  x = x.add(100)
		if (hasElement(252) && (i==17||i==18||i==19))  x = x.add(250)
		if (hasElement(258) && (i==17||i==18||i==19))  x = x.add(250)
		if (hasElement(277) && (i==20))  x = x.add(100)
		if (hasElement(280) && (i==17||i==18||i==19))  x = x.add(500)
        return x.floor()
    },
    getScaleName(i) {
        if (player.chal.comps[i].gte(i>12?100:1000)) return " Impossible"
        if (player.chal.comps[i].gte(i==8?200:i>8?50:300)) return " Insane"
        if (player.chal.comps[i].gte(i>8?10:75)) return " Hardened"
        return ""
    },
    getPower(i) {
		if(hasElement(379) && i <= 19)return E(0)
        let x = E(1)
        if (hasElement(2)) x = x.mul(0.75)
        if (hasElement(26)) x = x.mul(tmp.elements.effect[26])
		if (player.ranks.hex.gte(2)) x = x.mul(0.75)
		if (i >= 16 && i!=19) x = x.mul(30);
		if (i <= 12) x = x.mul(tmp.chal.eff[17]||1);
		if (hasPrestige(1,122)) x = x.mul(0.9)
        return x
    },
    getPower2(i) {
		if(hasElement(379) && i <= 19)return E(0)
        let x = E(1)
        if (hasElement(92)) x = x.mul(0.75)
        if (player.ranks.hex.gte(92) && (i<=8 || i>=10) && i<=12) x = x.mul(0.75)
		if (i >= 17 && i <= 19) x = x.mul(3);
        return x
    },
    getPower3(i) {
        let x = E(1)
		if (i>12)x = E(50)
		if(hasUpgrade('br',24))x = x.mul(0.8)
        if (hasChargedElement(2)) x = x.mul(0.95)
        if (hasChargedElement(26)) x = x.mul(tmp.elements.ceffect[26])
        if (hasChargedElement(92)) x = x.mul(0.95)
        return x
    },
    getChalData(x, r=E(-1), y) {
        let res = this.getResource(x,y)
        let lvl = r.lt(0)?player.chal.comps[x]:r
        let chal = this[x]
		if(hasElement(170)&&x==15)chal.inc = E(2);
        let fp = 1
        if (QCs.active() && x <= 12) fp /= tmp.qu.qc_eff[5]
        let s1 = x > 8 ? 10 : 75
        let s2 = 300
        if (x == 8) s2 = 200
        if (x > 8) s2 = 50
        let s3 = 1000
        if (x > 12) s3 = 100
        let pow = chal.pow
        if (hasElement(10) && (x==3||x==4)) pow = pow.mul(0.95)
        if (player.ranks.hex.gte(10) && (x==3||x==4)) pow = pow.mul(0.95)
        if (hasChargedElement(10) && x==20) pow = pow.mul(0.95)
		if (hasElement(453) && x==21) pow = pow.mul(0.8)
		if (hasElement(477) && x==21) pow = pow.mul(0.79)
		let start = chal.start
        chal.pow = chal.pow.max(1)
        let goal = chal.inc.pow(lvl.div(fp).pow(pow)).mul(chal.start)
        let bulk = res.div(chal.start).max(1).log(chal.inc).root(pow).mul(fp).add(1).floor()
        if (res.lt(chal.start)) bulk = E(0)
        if (lvl.max(bulk).gte(s1)) {
            let start = E(s1);
            let exp = E(3).pow(this.getPower(x));
            goal =
            chal.inc.pow(
                    lvl.div(fp).pow(exp).div(start.pow(exp.sub(1))).pow(pow)
                ).mul(chal.start)
            bulk = res
                .div(chal.start)
                .max(1)
                .log(chal.inc)
                .root(pow)
                .times(start.pow(exp.sub(1)))
                .root(exp).mul(fp)
                .add(1)
                .floor();
        }
        if (lvl.max(bulk).gte(s2)) {
            let start = E(s1);
            let exp = E(3).pow(this.getPower(x));
            let start2 = E(s2);
            let exp2 = E(4.5).pow(this.getPower2(x))
            goal =
            chal.inc.pow(
                    lvl.div(fp).pow(exp2).div(start2.pow(exp2.sub(1))).pow(exp).div(start.pow(exp.sub(1))).pow(pow)
                ).mul(chal.start)
            bulk = res
                .div(chal.start)
                .max(1)
                .log(chal.inc)
                .root(pow)
                .times(start.pow(exp.sub(1)))
                .root(exp)
                .times(start2.pow(exp2.sub(1)))
                .root(exp2).mul(fp)
                .add(1)
                .floor();
        }
        if (lvl.max(bulk).gte(s3)) {
            let start = E(s1);
            let exp = E(3).pow(this.getPower(x));
            let start2 = E(s2);
            let exp2 = E(4.5).pow(this.getPower2(x))
            let start3 = E(s3);
            let exp3 = E(1.001).pow(this.getPower3(x))
            goal =
            chal.inc.pow(
                    exp3.pow(lvl.div(fp).sub(start3)).mul(start3)
                    .pow(exp2).div(start2.pow(exp2.sub(1))).pow(exp).div(start.pow(exp.sub(1))).pow(pow)
                ).mul(chal.start)
            bulk = res
                .div(chal.start)
                .max(1)
                .log(chal.inc)
                .root(pow)
                .times(start.pow(exp.sub(1)))
                .root(exp)
                .times(start2.pow(exp2.sub(1)))
                .root(exp2)
                .div(start3)
			    .max(1)
			    .log(exp3)
			    .add(start3).mul(fp)
                .add(1)
                .floor();
        }
        return {goal: goal, bulk: bulk}
    },
    1: {
        title: "Instant Scale",
        desc: "Super Ranks & Mass Upgrades start scaling at 25. Super Tickspeed starts at 50.",
        reward() {
			if(hasElement(348))return `Meta-Tickspeed scaling starts later.`;
			return `Super Ranks start later, Super Tickspeed scaling is reduced.`
		},
        max: E(100),
        inc: E(5),
        pow: E(1.3),
        start: E(1.5e58),
        effect(x) {
            let rank = x.softcap(20,4,1).floor()
            let tick = E(0.96).pow(x.root(2))
            return {rank: rank, tick: tick}
        },
        effDesc(x) { if(hasElement(348))return format(x.rank.add(1),0)+"x later";return "+"+format(x.rank,0)+" later to Super Ranks, Super Tickspeed scaling "+format(E(1).sub(x.tick).mul(100))+"% weaker" },
    },
    2: {
        unl() { return player.chal.comps[1].gte(1) || player.atom.unl },
        title: "Anti-Tickspeed",
        desc: "You cannot buy Tickspeed.",
        reward: `For every completion add +7.5% to Tickspeed Power.`,
        max: E(100),
        inc: E(10),
        pow: E(1.3),
        start: E(1.989e40),
        effect(x) {
            let sp = E(0.5)
            if (hasElement(8)) sp = sp.pow(0.25)
            if (hasElement(39)) sp = E(1)
            let ret = x.mul(0.075).add(1).softcap(1.3,sp,0).sub(1)
            return ret
        },
        effDesc(x) { return "+"+format(x.mul(100))+"%"+((x.gte(0.3)&&!hasElement(39))?" <span class='soft'>(softcapped)</span>":"") },
    },
    3: {
        unl() { return player.chal.comps[2].gte(1) || player.atom.unl },
        title: "Melted Mass",
        desc: "Mass gain softcap starts /1e150 earlier, and is stronger.",
        reward: `Mass gain is raised by completions. (Doesn't work in this challenge)`,
        max: E(100),
        inc: E(25),
        pow: E(1.25),
        start: E(2.9835e49),
        effect(x) {
            if (hasElement(64)) x = x.mul(1.5)
            if (hasChargedElement(64))return expMult(x.add(1),2.6);
            let ret = x.root(1.5).mul(0.01).add(1)
			if(hasElement(310))return ret;
            return ret.softcap(3,E(0.25).pow(tmp.chal.eff[17]||1),0)
        },
        effDesc(x) { return "^"+format(x)+(x.gte(3)&&!hasElement(310)?" <span class='soft'>(softcapped)</span>":"") },
    },
    4: {
        unl() { return player.chal.comps[3].gte(1) || player.atom.unl },
        title: "Weakened Rage",
        desc: "Rage Points gain is rooted by 10. In addition, mass gain softcap starts /1e100 earlier.",
        reward: `Rage Powers gain is raised by completions.`,
        max: E(100),
        inc: E(30),
        pow: E(1.25),
        start: E(1.736881338559743e133),
        effect(x) {
            if (hasElement(64)) x = x.mul(1.5)
            if (hasChargedElement(64))return expMult(x.add(1),2.6);
            let ret = x.root(1.5).mul(0.01).add(1)
			if(hasElement(310))return ret;
			if (player.ranks.hex.gte(39))return ret.softcap(3,E(0.26).pow(tmp.chal.eff[17]||1),0);
            return ret.softcap(3,E(0.25).pow(tmp.chal.eff[17]||1),0)
        },
        effDesc(x) { return "^"+format(x)+(x.gte(3)&&!hasElement(310)?" <span class='soft'>(softcapped)</span>":"") },
    },
    5: {
        unl() { return player.atom.unl },
        title: "No Rank",
        desc: "You cannot rank up.",
        reward() {
			if(hasElement(519))return `Meta-Hept scaling starts later. Blue chroma affects this effect, but at a reduced rate.`;
			if(hasElement(421))return `Meta-Hex scaling starts later. Blue chroma affects this effect, but at a reduced rate.`;
			if(hasElement(348))return `Meta-Pent scaling starts later. Blue chroma affects this effect, but at a reduced rate.`;
			if(hasElement(265))return `Meta-Tetr scaling starts later.`;
			if(hasElement(230))return `Meta-Tier scaling starts later.`;
			if(hasElement(170))return `Meta-Rank scaling starts later.`;
			return `Rank requirement are weaker by completions.`
		},
        max: E(50),
        inc: E(50),
        pow: E(1.25),
        start: E(1.5e136),
        effect(x) {
			if(hasElement(519))return x.add(1).log10().mul(player.chal.comps[5]).pow(hasAscension(0,23)?1:1/3).add(10).log10().add(10).log10();
			if(hasElement(421))return x.add(1).log10().mul(player.chal.comps[5]).pow(hasAscension(0,23)?1:1/3).add(10).log10();
			if(hasElement(348))return x.add(1).log10().mul(player.chal.comps[5]).pow(hasAscension(0,23)?1:1/3).add(1);
			if(hasElement(170))return x.pow(hasElement(230)?1:hasElement(199)?0.8:0.6).add(1);
            let ret = E(0.97).pow(x.root(2).softcap(5,0.5,0)).max(E("e-1e10"));
            return ret
        },
        effDesc(x) { if(hasElement(170))return format(x)+"x later";return format(E(1).sub(x).mul(100))+"% weaker"+(x.log(0.97).gte(5)?" <span class='soft'>(softcapped)</span>":"") },
    },
    6: {
        unl() { return player.chal.comps[5].gte(1) || player.supernova.times.gte(1) || quUnl() },
        title: "No Tickspeed & Condenser",
        desc: "You cannot buy Tickspeed & BH Condenser.",
        reward: `For every completions adds +10% to Tickspeed & BH Condenser Power.`,
        max: E(50),
        inc: E(64),
        pow: E(1.25),
        start: E(1.989e38),
        effect(x) {
            let ret = x.mul(0.1).add(1).softcap(1.5,hasElement(39)?1:0.5,0).sub(1)
            return ret
        },
        effDesc(x) { return "+"+format(x)+"x"+((x.gte(0.5)&&!hasElement(39))?" <span class='soft'>(softcapped)</span>":"") },
    },
    7: {
        unl() { return player.chal.comps[6].gte(1) || player.supernova.times.gte(1) || quUnl() },
        title: "No Rage Powers",
        desc: "You cannot gain Rage Powers, but Dark Matters are gained by mass instead of Rage Powers at a reduced rate.<br>In addtional, mass gain softcap is stronger.",
        reward() {
			if(hasElement(348))return `Rage Powers gain are raised by completions. Blue chroma affects this effect, but at a reduced rate.<br><span class="yellow">On 16th completion, unlock Elements</span>`;
			return `Completions adds 2 maximum completions of 1-4 Challenge.<br><span class="yellow">On 16th completion, unlock Elements</span>`
		},
        max: E(50),
        inc: E(64),
        pow: E(1.25),
        start: E(1.5e76),
        effect(x) {
            let ret = x.mul(2)
            if (hasElement(5)) ret = ret.mul(2)
            if (hasChargedElement(5)) ret = ret.pow(20)
            if (hasChargedElement(13)) ret = ret.pow(1.7)
            if (hasChargedElement(20)) ret = ret.pow(1.1)
            if (hasChargedElement(41)) ret = ret.pow(1.3)
            if (hasChargedElement(60)) ret = ret.pow(1.7)
            if (hasChargedElement(65)) ret = ret.pow(1.3)
            if (hasChargedElement(70)) ret = ret.pow(1.3)
            return ret.floor()
        },
        effDesc(x) { if(hasElement(348))return "^"+format(E(2).pow(player.chal.comps[7].mul(x.add(1).log10()).pow(0.625).add(1)));return "+"+format(x,0) },
    },
    8: {
        unl() { return player.chal.comps[7].gte(1) || player.supernova.times.gte(1) || quUnl() },
        title: "White Hole",
        desc: "Dark Matter & Mass from Black Hole gains are rooted by 8.",
        reward: `Dark Matter & Mass from Black Hole gains are raised by completions.<br><span class="yellow">On first completion, unlock 3 rows of Elements</span>`,
        max: E(50),
        inc: E(80),
        pow: E(1.3),
        start: E(1.989e38),
        effect(x) {
            if (hasElement(64)) x = x.mul(1.5)
			if(hasChargedElement(70))return expMult(x.add(1),2.65);
			if(hasChargedElement(65))return expMult(x.add(1),2.64);
			if(hasChargedElement(56))return expMult(x.add(1),2.63);
			if(hasChargedElement(33))return expMult(x.add(1),2.62);
            let ret = x.root(1.75).mul(0.02).add(1)
			if(hasElement(310))return ret;
            return ret.softcap(2.3,0.25,0)
        },
        effDesc(x) { return "^"+format(x)+(x.gte(2.3)&&!hasElement(310)?" <span class='soft'>(softcapped)</span>":"") },
    },
    9: {
        unl() { return hasTree("chal4") },
        title: "No Particles",
        desc: "You cannot assign quarks. In addtional, mass gains exponent is raised to 0.9th power.",
        reward: `Improve Magnesium-12 better.`,
        max: E(100),
        inc: E('e500'),
        pow: E(2),
        start: E('e9.9e4').mul(1.5e56),
        effect(x) {
            let ret = x.root(hasTree("chal4a")?3.5:4).mul(0.1).add(1).softcap(82,hasChargedElement(104)?0.3:0.2,0)
            return ret
        },
        effDesc(x) { return "^"+format(x) },
    },
    10: {
        unl() { return hasTree("chal5") },
        title: "The Reality I",
        desc: "All challenges 1-8 are applied at once. In addtional, you are trapped in Mass Dilation!",
        reward: `The exponent of the RP formula is multiplied by completions. (this effect doesn't work while in this challenge)<br><span class="yellow">On first completion, unlock Fermions!</span>`,
        max: E(100),
        inc: E('e2000'),
        pow: E(2),
        start: E('e3e4').mul(1.5e56),
        effect(x) {
			if(hasChargedElement(104))return x.add(1)
            let ret = x.root(1.75).mul(0.01).add(1)
            return ret
        },
        effDesc(x) { return format(x)+"x" },
    },
    11: {
        unl() { return hasTree("chal6") },
        title: "Absolutism",
        desc: "You cannot gain relativistic particles or dilated mass. However, you are stuck in Mass Dilation.",
        reward: `Star Booster is stonger by completions.`,
        max: E(100),
        inc: E("ee6"),
        pow: E(2),
        start: uni("e3.8e7"),
        effect(x) {
			if(hasChargedElement(104))return x.add(1)
            let ret = x.root(2).div(10).add(1)
            return ret
        },
        effDesc(x) { return format(x)+"x stronger" },
    },
    12: {
        unl() { return hasTree("chal7") },
        title: "Decay of Atom",
        desc: "You cannot gain Atoms & Quarks.",
        reward: `Completions add free Radiation Boosters.<br><span class="yellow">On first completion, unlock new prestige layer!</span>`,
        max: E(100),
        inc: E('e2e7'),
        pow: E(2),
        start: uni('e8.4e8'),
        effect(x) {
			if(hasChargedElement(133))return Decimal.pow(10,expMult(x.add(10),0.5)).sub(1e10)
			if(hasChargedElement(104))return x
            let ret = x.root(hasTree("chal7a")?1.5:2)
            return ret
        },
        effDesc(x) { return "+"+format(x) },
    },
    13: {
        unl() { return hasElement(155) },
        title: "No Quantum",
        desc: "You cannot gain Quantum Foams, Quantizes, Death Shards, Chromas, Blueprint Particles and Entropy.",
        reward: `When outside Big Rips, raise Chromas gain and effect to a power.<br><span class="yellow">On 4th completion, unlock more Elements</span>`,
        max: E(100),
        inc: E('ee40'),
        pow: E(8.2),
        start: E('ee40'),
        effect(x) {
			if(CHALS.inChal(17) || CHALS.inChal(19))return E(1)
			if(hasChargedElement(39)){
				if(x.gte(200))x=x.div(2).log10().mul(100);
			}else if(hasChargedElement(8)){
				if(x.gte(100))x=x.log10().mul(50);
			}else{
				if(x.gte(10))x=x.log10().mul(10);
			}
            let ret = x.div(100).add(1)
            return ret
        },
        effDesc(x) { return "^"+format(x)+(x.gte(1.1)?" <span class='soft'>(softcapped)</span>":"") },
    },
    14: {
        unl() { return hasElement(159) },
        title: "The Reality II",
        desc: "All challenges 1-12 are applied at once. In addtional, you are trapped in Big Rip!",
        reward() {
			if(hasUpgrade('br',22))return `Death Shards gain is raised by completions.`;
			return `Death Shards gain softcap is weaker.`
		},
        max: E(100),
        inc: E('e2.5e11'),
        pow: E(2),
        start: E('e2e12'),
        effect(x) {
			if(CHALS.inChal(17) || CHALS.inChal(19))return E(1)
			if(hasUpgrade('br',22)){
				return x.add(1e10).log10().div(10);
			}
            let ret = E(0.97).pow(x.root(2).softcap(25,0.56,0).softcap(42,0.1,0))
            return ret
        },
        effDesc(x) { if(hasUpgrade('br',22))return "^"+format(x);return format(E(1).sub(x).mul(100))+"% weaker"+(x.log(0.97).gte(25)?" <span class='soft'>(softcapped)</span>":"") },
    },
    15: {
        unl() { return hasElement(164) },
        title: "Super Overflow",
        desc: "Mass Overflow starts at 10, and 12x stronger. Black Hole Overflow starts at 10, and stronger.",
        reward: `Mass Overflow starts later.`,
        max: E(100),
        inc: E('e1e14'),
        pow: E(5),
        start: E('e1e13'),
        effect(x) {
			if(CHALS.inChal(17) || CHALS.inChal(19))return E(1)
            let ret = x.add(1)
            return ret
        },
        effDesc(x) { return "^"+format(x) },
    },
    16: {
        unl() { return hasElement(168) },
        title: "No Prestige Mass",
        desc: "You cannot gain Prestige Mass. Entering this challenge resets your Prestige Mass.",
        reward: `First Prestige Mass effect softcap is weaker.<br><span class="yellow">On 3rd completion, unlock more Elements</span>`,
        max: E(100),
        inc: E('e3e86'),
        pow: E(1.45),
        start: E('e1.65e87'),
        effect(x) {
			if(CHALS.inChal(17) || CHALS.inChal(19))return E(1)
            let ret = E(0.93).pow(x.root(2))
            return ret
        },
        effDesc(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
    },
    17: {
        unl() { return hasElement(192) },
        title: "No Challenges",
        desc: "You cannot gain C1-C12 completions. C13-C16 has no effect.",
        reward: `C3-C4 softcap is weaker. Hardened challenge scaling of C1-C12 is weaker.<br><span class="yellow">On 3rd completion, unlock more Elements</span>`,
        max: E(100),
        inc: E('e3e619'),
        pow: E(3),
        start: E('ee619'),
        effect(x) {
            let ret = E(0.95).pow(x.root(2))
            return ret
        },
        effDesc(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
    },
    18: {
        unl() { return hasElement(205) },
        title: "No Infinity Mass",
        desc: "You cannot gain Infinity Mass.",
        reward: `Boost Infinity Mass base formula.<br><span class="yellow">On 3rd completion, unlock more Elements</span>`,
        max: E(100),
        inc: E('ee2684'),
        pow: E(9),
        start: E('ee2683'),
        effect(x) {
			if(hasElement(351))return x.add(1).log10().add(1).log10().mul(1.75).pow(2);
            let ret = x.add(1).log10().add(1).log10().add(1).log10().softcap(0.09,hasElement(233)?1:0.25,0).mul(hasElement(233)?4.2:1);
            return ret
        },
        effDesc(x) { return "+"+format(x)+((x.gte(0.09) && !hasElement(233))?" <span class='soft'>(softcapped)</span>":"") },
    },
    19: {
        unl() { return hasElement(209) },
        title: "The Reality III",
        desc: "All challenges 1-18 are applied at once.",
        reward: `Multiply Shard Generators Power.<br><span class="yellow">On 8th completion, unlock more Elements</span>`,
		max: E(100),
		inc: E(10),
		pow: E(1.25),
        start: E("1e191"),
        effect(x) {
            let ret = x.div(4).add(1);
            return ret
        },
        effDesc(x) { return format(x)+"x" },
    },
    20: {
        unl() { return hasElement(213) },
        title: "Logarithmical Mass",
        desc: "Mass gain is set to log10(mass gain).",
        reward: `Mass gain is raised by completions.`,
		max: E(100),
		inc: E(10),
		pow: E(1.25),
        start: E("1e3149"),
        effect(x) {
			if(player.chal.active == 22)return E(1);
			if(hasPrestige(2,17))x = x.pow(2);
			if(hasElement(277))x = x.pow(1.25);
			if(!hasTree('qp19'))x = x.softcap(1e6,hasElement(489)?0.86:hasElement(465)?0.84:hasElement(433)?0.7:hasElement(429)?0.5:hasElement(417)?0.3:hasElement(409)?0.1:hasElement(397)?0.03:0.01,0);
			x = x.softcap(hasElement(527)?1.5e7:1e7,hasTree('qp27')?0.85:hasTree('qp25')?0.7:0.1,0);
            let ret = E(2).pow(x);
			if(hasElement(229))ret = ret.pow(3);
			if(hasElement(334))ret = Decimal.pow(10,Decimal.pow(2.6,x.root(4)));
			if(hasElement(343))ret = Decimal.pow(10,Decimal.pow(1.44,x.root(3)));
			if(player.chal.active == 21)return ret.min('e2e25');
            return ret
        },
        effDesc(x) { return "^"+format(x) },
    },
    21: {
        unl() { return hasElement(438) },
        title: "No Supernova Galaxies",
        desc: "Supernova Galaxies, Galactic Resources and Galactic Particles have no effect except QoL effects. Also You're trapped in Galactic Challenge Difficulty 10, and C20's effect is capped at ^e2e25.",
        reward: `Super Supernova Galaxies starts later.`,
		max: E(100),
		inc: E(1e10),
		pow: E(10),
        start: E("4e18493813"),
        effect(x) {
			let ret = x.mul(12).min(x.mul(2).add(10));
			return ret
        },
        effDesc(x) { return "+"+format(x)+" later" },
    },
    22: {
        unl() { return hasElement(476) },
        title: "No Black Hole",
        desc: "You can't gain Mass of Black Hole. Also You're trapped in Galactic Challenge Difficulty 12, and C20 has no effect.",
        reward: `2nd Black Hole Overflow effect is weaker.`,
		max: E(100),
		inc: E(1e100),
		pow: E(2),
        start: E("1e30000"),
        effect(x) {
            let ret = E(0.99).pow(x.root(2))
            return ret
        },
        effDesc(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
    },
    cols: 22,
}

/*
3: {
    unl() { return player.chal.comps[2].gte(1) },
    title: "Placeholder",
    desc: "Placeholder.",
    reward: `Placeholder.`,
    max: E(50),
    inc: E(10),
    pow: E(1.25),
    start: EINF,
    effect(x) {
        let ret = E(1)
        return ret
    },
    effDesc(x) { return format(x)+"x" },
},
*/

