import { Group } from '../models/Group.js';

/** GET /api/groups — liste de tous les groupes thématiques. */
export async function listGroups(req, res) {
  const groups = await Group.find()
    .populate('owner', 'username')
    .sort({ createdAt: -1 });
  return res.json(groups);
}

/** POST /api/groups — crée un groupe ; le créateur en est propriétaire et premier membre. */
export async function createGroup(req, res) {
  const { name, description = '' } = req.body || {};
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Le nom du groupe est requis.' });
  }

  const existing = await Group.findOne({ name: name.trim() });
  if (existing) {
    return res.status(409).json({ error: 'Un groupe porte déjà ce nom.' });
  }

  const group = await Group.create({
    name: name.trim(),
    description: description.trim(),
    owner: req.userId,
    members: [req.userId],
  });
  await group.populate('owner', 'username');
  return res.status(201).json(group);
}

/** GET /api/groups/:id — détail d'un groupe et de ses membres. */
export async function getGroup(req, res) {
  const group = await Group.findById(req.params.id)
    .populate('owner', 'username')
    .populate('members', 'username');
  if (!group) {
    return res.status(404).json({ error: 'Groupe introuvable.' });
  }
  return res.json(group);
}

/** POST /api/groups/:id/join — rejoint un groupe (idempotent). */
export async function joinGroup(req, res) {
  const group = await Group.findById(req.params.id);
  if (!group) {
    return res.status(404).json({ error: 'Groupe introuvable.' });
  }

  if (!group.members.some((m) => String(m) === req.userId)) {
    group.members.push(req.userId);
    await group.save();
  }
  await group.populate('owner', 'username');
  await group.populate('members', 'username');
  return res.json(group);
}

/** POST /api/groups/:id/leave — quitte un groupe (le propriétaire ne peut pas le quitter). */
export async function leaveGroup(req, res) {
  const group = await Group.findById(req.params.id);
  if (!group) {
    return res.status(404).json({ error: 'Groupe introuvable.' });
  }
  if (String(group.owner) === req.userId) {
    return res.status(400).json({ error: 'Le propriétaire ne peut pas quitter son groupe.' });
  }

  group.members = group.members.filter((m) => String(m) !== req.userId);
  await group.save();
  await group.populate('owner', 'username');
  await group.populate('members', 'username');
  return res.json(group);
}
