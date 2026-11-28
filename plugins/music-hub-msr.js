"use strict";
const axios = require("axios");

const API = "https://monster-siren.hypergryph.com/api";
let songsCache = null;
let songsCacheTs = 0;
let albumsCache = null;
let albumsCacheTs = 0;

async function fetchAllAlbums() {
  const now = Date.now();
  if (albumsCache && albumsCache.length && now - albumsCacheTs < 1800 * 1000) return albumsCache;
  const { data } = await axios.get(`${API}/albums`, { timeout: 8000 });
  const list = data?.data || [];
  if (list.length) {
    albumsCache = list;
    albumsCacheTs = now;
  }
  return list;
}

async function fetchAllSongs() {
  const now = Date.now();
  if (songsCache && songsCache.length && now - songsCacheTs < 1800 * 1000) return songsCache;
  const { data } = await axios.get(`${API}/songs`, { timeout: 8000 });
  const list = data?.data?.list || [];
  if (list.length) {
    songsCache = list;
    songsCacheTs = now;
  }
  return list;
}

module.exports = {
  platform: "MusicHub·塞壬唱片",
  author: "MusicHub",
  version: "1.0.2",
  cacheControl: "no-cache",
  supportedSearchType: ["music", "album"],

  async search(query, page, type) {
    const q = (query || "").toLowerCase();
    if (type === "album") {
      const allAlbums = await fetchAllAlbums();
      const matchedAlbums = allAlbums.filter((a) => !q || a.name.toLowerCase().includes(q));
      const slice = matchedAlbums.slice((page - 1) * 20, page * 20);
      return {
        isEnd: page * 20 >= matchedAlbums.length,
        data: slice.map((a) => ({
          id: a.cid,
          title: a.name,
          artist: (a.artistes || []).join(" / ") || "塞壬唱片-MSR",
          artwork: a.coverUrl,
        })),
      };
    }

    const [all, albums] = await Promise.all([fetchAllSongs(), fetchAllAlbums().catch(() => [])]);
    const albumMap = new Map(albums.map((a) => [a.cid, a]));
    const matched = all.filter(
      (s) => !q || s.name.toLowerCase().includes(q) || (s.artists || []).join(",").toLowerCase().includes(q)
    );
    const slice = matched.slice((page - 1) * 20, page * 20);
    return {
      isEnd: page * 20 >= matched.length,
      data: slice.map((s) => {
        const alb = albumMap.get(s.albumCid);
        return {
          id: s.cid,
          title: s.name,
          artist: (s.artists || []).join(" / ") || "塞壬唱片-MSR",
          album: alb?.name || "",
          artwork: alb?.coverUrl || undefined,
          albumCid: s.albumCid,
        };
      }),
    };
  },

  async getAlbumInfo(albumItem) {
    const { data } = await axios.get(`${API}/album/${albumItem.id}/detail`, { timeout: 8000 });
    const d = data?.data || {};
    const fallbackArtists = (d.artistes || []).join(" / ") || "塞壬唱片-MSR";
    return {
      isEnd: true,
      albumItem: { ...albumItem, artwork: d.coverUrl, description: d.intro },
      musicList: (d.songs || []).map((s) => ({
        id: s.cid,
        title: s.name,
        artist: (s.artistes && s.artistes.length ? s.artistes.join(" / ") : fallbackArtists),
        album: d.name,
        artwork: d.coverUrl,
      })),
    };
  },

  async getMediaSource(musicItem) {
    const { data } = await axios.get(`${API}/song/${musicItem.id}`, { timeout: 8000 });
    const d = data?.data || {};
    if (!d.sourceUrl) throw new Error("未找到官方音频直链");
    return { url: d.sourceUrl };
  },

  async getLyric(musicItem) {
    try {
      const { data } = await axios.get(`${API}/song/${musicItem.id}`, { timeout: 6000 });
      const lrcUrl = data?.data?.lyricUrl;
      if (lrcUrl) {
        const res = await axios.get(lrcUrl, { timeout: 6000 });
        return { rawLrc: String(res.data || "") };
      }
    } catch (_) {}
    return { rawLrc: "" };
  },

  async getTopLists() {
    const allAlbums = await fetchAllAlbums();
    return [
      {
        title: "塞壬唱片官方专辑库",
        data: allAlbums.slice(0, 30).map((a) => ({
          id: a.cid,
          title: a.name,
          coverImg: a.coverUrl,
          description: (a.artistes || []).join(" / "),
        })),
      },
    ];
  },

  async getTopListDetail(topListItem) {
    const res = await this.getAlbumInfo(topListItem);
    return {
      isEnd: true,
      topListItem: { ...topListItem, coverImg: res.albumItem.artwork },
      musicList: res.musicList,
    };
  },
};
